import express from 'express';
import {body} from "express-validator"
import {authDriver} from "../middlewares/auth.js";
import { getDriver, logInDriver, logOutDriver, registerDriver } from '../controllers/driverController.js';

const driverRouter = express.Router();

driverRouter.post("/register", [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')],
    registerDriver);

driverRouter.post("/login", logInDriver);
driverRouter.get("/get-driver", authDriver, getDriver);
driverRouter.post("/logout", authDriver, logOutDriver);

export default driverRouter;