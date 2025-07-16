import userModel from "../models/userModel.js";
import driverModel from "../models/driverModel.js";
import blackListTokenModel from "../models/blackListTokenModel.js";
import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ success: false, message: "Not Authorized" });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log(token_decode);
        const user = await userModel.findById(token_decode.id);
        console.log(user)
        req.user = user;
        return next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const authDriver = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ success: false, message: "Not Authorized" });
    }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const driver = await driverModel.findById(token_decode.id);
        req.driver = driver;
        return next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {authUser, authDriver};