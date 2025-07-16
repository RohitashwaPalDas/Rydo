import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import driverModel from "../models/driverModel.js";
import blackListTokenModel from "../models/blackListTokenModel.js";
import { validationResult } from 'express-validator';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const registerDriver = async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Some error occurred", errors: errors.array() });
        }

        const { fullname, email, password, vehicle } = req.body;

        if(!fullname.firstname || !email || !password || !vehicle.color || !vehicle.capacity || !vehicle.plate || !vehicle.vehicleType){
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const exists = await driverModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Driver already exist' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newDriver = new driverModel({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword,
            vehicle: {
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        },
            date: Date.now()
        });

        const driver = await newDriver.save();

        const token = generateToken(driver._id);

        res.status(201).json({ success: true, message: "registered Successfully", token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

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
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        await blackListTokenModel.create({ token });

        res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export {registerDriver, logInDriver, getDriver, logOutDriver};