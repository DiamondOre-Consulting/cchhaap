import {Router} from "express"
import { sendOtp, signin, signout, signup } from "../controllers/auth/user.auth.js"
import { userSendOtpBodySchema, userSigninBodySchema, userSignupBodySchema } from "../validator/user.auth.validator.js"
import validate from "../middlewares/zod.validator.js"





const userRouter = Router()






userRouter.post('/send-otp',validate({
   body:userSendOtpBodySchema
}),sendOtp)

userRouter.post('/signup',validate({
    body:userSignupBodySchema
}),signup)


userRouter.post('/signin',validate({
    body:userSigninBodySchema
}),signin)


userRouter.get('/signout',signout)


export default userRouter