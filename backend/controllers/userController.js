import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import blackListTokenModel from "../models/blackListTokenModel.js";
import { validationResult } from 'express-validator';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Some error occurred", errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        if (!fullname.firstname || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'User already exist' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword,
            date: Date.now()
        });

        const user = await newUser.save();

        const token = generateToken(user._id);

        res.status(201).json({ success: true, message: "registered Successfully", token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
};

const logInUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User can't find with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect Password" });
        }

        if (isMatch) {
            const token = generateToken(user._id);
            res.cookie('token', token);
            res.status(200).json({ success: true, message: "logged in Successfully", token })
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

const getUser = async (req, res) => {
    res.status(200).json(req.user);
}

const logOutUser = async (req, res, next) => {
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

export { registerUser, logInUser, getUser, logOutUser };