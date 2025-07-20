import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/connectDb.js";
import userRouter from "./routes/userRoute.js";
import driverRouter from "./routes/driverRoute.js";
import mapRouter from "./routes/mapsRoute.js";
import rideRouter from "./routes/rideRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
connectDB();

app.use("/api/user", userRouter);
app.use("/api/driver", driverRouter);
app.use("/api/map", mapRouter);
app.use("/api/ride", rideRouter);


app.get('/', (req,res)=>{
    res.send("API working");
});

export default app;