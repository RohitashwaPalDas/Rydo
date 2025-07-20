import rideModel from "../models/rideModel.js";
import { validationResult } from 'express-validator';
import { getDistanceAndTime } from "./mapCOntroller.js";
import axios from 'axios'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import driverModel from "../models/driverModel.js";
import userModel from "../models/userModel.js";
import { sendMessageToSocketId } from "../socket.js";
import razorpay from 'razorpay';
import dotenv from "dotenv";
dotenv.config();


const MAPBOX_TOKEN = process.env.MAPBOX_API_KEY;
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

const razorpay_instance = new razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

const currency = "INR";

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

async function fetchCoordinates(address) {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}`;
    const response = await axios.get(url);
    if (response.data.features.length === 0) {
        throw new Error(`No coordinates found for "${address}"`);
    }
    console.log(response.data.features[0].geometry.coordinates)
    return response.data.features[0].geometry.coordinates;
}

async function fetchDistanceAndTime(origin, destination) {
    const originCoords = await fetchCoordinates(origin);
    const destCoords = await fetchCoordinates(destination);

    const coords = `${originCoords.join(',')};${destCoords.join(',')}`;
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coords}?access_token=${MAPBOX_TOKEN}&geometries=geojson`;

    const response = await axios.get(directionsUrl);
    const route = response.data.routes[0];
    if (!route) {
        throw new Error("No route found");
    }

    return {
        distance: {
            value: route.distance,
        },
        duration: {
            value: route.duration,
        },
    };
}

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await fetchDistanceAndTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fare = {
        auto: Math.round(
            baseFare.auto +
            (distanceTime.distance.value / 1000) * perKmRate.auto +
            (distanceTime.duration.value / 60) * perMinuteRate.auto
        ),
        car: Math.round(
            baseFare.car +
            (distanceTime.distance.value / 1000) * perKmRate.car +
            (distanceTime.duration.value / 60) * perMinuteRate.car
        ),
        moto: Math.round(
            baseFare.moto +
            (distanceTime.distance.value / 1000) * perKmRate.moto +
            (distanceTime.duration.value / 60) * perMinuteRate.moto
        ),
    };
    console.log(fare);
    return fare;
}

const getDriversInTheRadius = async (lng, lat, radiusInKm) => {
    try {
        const drivers = await driverModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lng, lat], // Longitude first, then latitude
                    },
                    $maxDistance: radiusInKm * 1000, // convert km to meters
                },
            },
        });

        return drivers;
    } catch (error) {
        console.error("Error in getDriversInTheRadius:", error);
        return [];
    }
};



const createRide = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const user = req.user._id;

        const { userId, pickup, destination, vehicleType } = req.body;


        if (!user || !pickup || !destination || !vehicleType) {
            res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const fare = await getFare(pickup, destination);
        console.log(fare);
        const newRide = new rideModel({
            user,
            pickup,
            destination,
            fare: fare[vehicleType],
            otp: getOtp(6),
            paymentMethod: "razorpay",
        })
        console.log(newRide);
        const ride = await newRide.save();
        res.status(201).json({ success: true, message: "created Successfully", ride });

        const pickupCoordinates = await fetchCoordinates(pickup);

        const driversInRadius = await getDriversInTheRadius(pickupCoordinates[0], pickupCoordinates[1], 2);

        ride.otp = ""

        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

        driversInRadius.map(driver => {
            sendMessageToSocketId(driver.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })

        })


    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const getRideFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const confirmRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {

        if (!rideId) {
            throw new Error('Ride id is required');
        }

        await rideModel.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'accepted',
            driver: req.driver._id
        })

        const ride = await rideModel.findOne({
            _id: rideId
        }).populate('user').populate('driver').select('+otp');

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);

    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

const startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {

        if (!rideId || !otp) {
            throw new Error('Ride id and OTP are required');
        }

        const ride = await rideModel.findOne({
            _id: rideId
        }).populate('user').populate('driver').select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        if (ride.status !== 'accepted') {
            throw new Error('Ride not accepted');
        }

        if (ride.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        await rideModel.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'ongoing'
        })

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {

        if (!rideId) {
            throw new Error('Ride id is required');
        }

        const ride = await rideModel.findOne({
            _id: rideId,
            driver: req.driver._id
        }).populate('user').populate('driver').select('+otp');

        if (!ride) {
            throw new Error('Ride not found');
        }

        if (ride.status !== 'ongoing') {
            throw new Error('Ride not ongoing');
        }

        await rideModel.findOneAndUpdate({
            _id: rideId
        }, {
            status: 'completed'
        })

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const paymentRazorpay = async (req, res) => {
  try {
    const { rideId } = req.body;

    const ride = await rideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ success: false, message: "Ride not found" });
    }

    const options = {
      amount: ride.fare * 100, // Razorpay accepts amount in paise
      currency: "INR",
      receipt: ride._id.toString()
    };

    razorpay_instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
      }

      res.json({ success: true, order });
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};





const verifyRazorPay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;

    // Fetch order info from Razorpay
    const orderInfo = await razorpay_instance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const updatedRide = await rideModel.findByIdAndUpdate(
        orderInfo.receipt,
        { payment: true },
        { new: true }
      ).populate("user driver");

      console.log("Updated Ride:", updatedRide);

      // Notify the driver via socket
      const driver = updatedRide?.driver;
      const user = updatedRide?.user;

      console.log("/////////DRIVER AND USER INFO/////////");
      console.log(driver, user);

      if (driver?.socketId) {
        sendMessageToSocketId(driver.socketId, {
          event: "payment-success",
          data: {
            success: true,
            rideId: updatedRide._id,
            message: `Payment received from ${user?.fullname?.firstname || "user"}`,
            fare: updatedRide.fare,
            paymentMethod: updatedRide.paymentMethod,
          },
        });
      }

      return res.json({ success: true, message: "Payment Successful" });
    } else {
      return res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error("🔴 Payment verification error:", error);
    return res.json({ success: false, message: error.message });
  }
};




export { createRide, getRideFare, confirmRide, startRide, endRide, verifyRazorPay, paymentRazorpay };