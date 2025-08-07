import express from "express"
import {config} from 'dotenv'
import morgan  from "morgan"
import cookieParser from "cookie-parser"
import adminRouter from "./routes/admin.routes.js"
import userRouter from "./routes/user.routes.js"
import errorMiddleware from "./middlewares/error.middleware.js"
// import { rateLimiter } from "./utils/rateLimitter.js"
import cloudinary from "cloudinary"
import Razorpay from "razorpay"
import cors from 'cors'
// import paymentRouter from "./routes/payment.route.js"
const app= express()
config()

// app.use(rateLimiter)
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
     origin:["http://localhost:5173","http://localhost:5174","http://localhost:5175","https://cchhaap.onrender.com","https://cchhaap-backend.onrender.com"],
     credentials:true
}))

cloudinary.v2.config({
  cloud_name : process.env.cloud_name,
  api_key : process.env.api_key,
  api_secret: process.env.api_secret
})

app.use("/api/v1/admin",adminRouter)
app.use("/api/v1/user", userRouter)
// app.use("/api/v1/payment",paymentRouter)


// app.all("*",(req,res)=>{
//      res.status(404).json({message : "OOPS! 404 Page not found"})
// })
app.use(errorMiddleware);

export const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_SECRET,
});


export default app;