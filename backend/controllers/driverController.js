import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import driverModel from "../models/driverModel.js";
import blackListTokenModel from "../models/blackListTokenModel.js";
import { validationResult } from 'express-validator';
import rideModel from "../models/rideModel.js";
import mongoose from "mongoose";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const registerDriver = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation failed", errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        if (
            !fullname?.firstname ||
            !email ||
            !password ||
            !vehicle?.color ||
            !vehicle?.plate ||
            !vehicle?.capacity ||
            !vehicle?.vehicleType
        ) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const exists = await driverModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Driver already exists' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDriver = new driverModel({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname || ''
            },
            email,
            password: hashedPassword,
            vehicle: {
                color: vehicle.color,
                plate: vehicle.plate,
                capacity: vehicle.capacity,
                vehicleType: vehicle.vehicleType
            },
            location: {
                type: 'Point',
                coordinates: [0, 0] 
            },
            date: Date.now()
        });

        const driver = await newDriver.save();

        const token = generateToken(driver._id);

        res.status(201).json({
            success: true,
            message: "Registered successfully",
            token
        });

    } catch (error) {
        console.error('Driver Registration Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const logInDriver = async(req,res)=>{
    try {
        const { email, password } = req.body;

        const driver = await driverModel.findOne({ email });
        if (!driver) {
            return res.status(400).json({ success: false, message: "Driver can't find with this email" });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        if (isMatch) {
            const token = generateToken(driver._id);
            res.cookie('token', token);
            res.status(200).json({ success: true, message: "logged in Successfully", token })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const getDriver = async(req,res)=>{
    res.status(200).json(req.driver);
}

const logOutDriver = async(req,res)=>{
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token missing' });
        }

        await blackListTokenModel.updateOne(
            { token },
            { $set: { token } },
            { upsert: true }
        );

        res.clearCookie('token');
        res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

async function getDriverStats(req,res) {

    try {
        const {driverId} = req.query;
        console.log('Driver ID:', driverId); 
        const result = await rideModel.aggregate([
            {
                $match: {
                    driver: new mongoose.Types.ObjectId(driverId),
                    status: 'completed',
                    payment: true
                }
            },
            {
                $group: {
                    _id: '$driver',
                    totalRides: { $sum: 1 },
                    totalEarnings: { $sum: '$fare' }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(200).json({success:true, message:{ totalRides: 0, totalEarnings: 0 }});
        }

        const { totalRides, totalEarnings } = result[0];
        res.status(200).json({success:true, message:{ totalRides, totalEarnings }});
    } catch (err) {
        console.error('Error calculating stats:', err);
        return null;
    }
}

export {registerDriver, logInDriver, getDriver, logOutDriver, getDriverStats};