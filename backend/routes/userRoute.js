import express from "express";
import { getUser, logInUser, logOutUser, registerUser } from "../controllers/userController.js";
import {body} from "express-validator"
import {authUser} from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register",[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], registerUser);

userRouter.post("/login", logInUser);

userRouter.get('/get-user', authUser, getUser);

userRouter.post("/logout", authUser, logOutUser);

export default userRouter;