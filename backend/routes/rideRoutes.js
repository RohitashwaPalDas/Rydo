import express from 'express';
import { authDriver, authUser } from '../middlewares/auth.js';
import { confirmRide, createRide, endRide, getRideFare, paymentRazorpay, startRide, verifyRazorPay } from '../controllers/rideController.js';
import { body, query } from 'express-validator';

const rideRouter = express.Router();

rideRouter.post('/create',
    authUser, 
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
   createRide
);

rideRouter.get('/get-fare',
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    getRideFare
)

rideRouter.post('/confirm',
    authDriver,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    confirmRide
)

rideRouter.get('/start-ride',
    authDriver,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    startRide
)

rideRouter.post('/end-ride',
    authDriver,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    endRide
)

rideRouter.post('/razorpay', authUser, paymentRazorpay)

rideRouter.post("/verifyrazorpay", authUser, verifyRazorPay)

export default rideRouter;