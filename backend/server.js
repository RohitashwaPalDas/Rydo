import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./config/connectDb.js";
import userRouter from "./routes/userRoute.js";
import driverRouter from "./routes/driverRoute.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
connectDB();

app.use("/api/user", userRouter);
app.use("/api/driver", driverRouter);

app.get('/', (req,res)=>{
    res.send("API working");
});

app.listen(port, ()=>{
    console.log("Listening to port" + port)
});
