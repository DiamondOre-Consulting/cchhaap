import {Router} from "express"
import { addAddress, deleteAddress, editAddress, forgotPassword, getAllAddress, getUser, resetPassword, sendOtp, signin, signout, signup } from "../controllers/auth/user.auth.js"
import { forgotPasswordBodySchema, resetPasswordBodySchema, resetPasswordParamsSchema, userSendOtpBodySchema, userSigninBodySchema, userSignupBodySchema } from "../validator/user.auth.validator.js"
import validate from "../middlewares/zod.validator.js"
import { userMiddleware } from "../middlewares/user.middleware.js"
import { addAddressBodySchema, deleteAddressParamsSchema, editAddressBodySchema, editAddressParamsSchema } from "../validator/address.validator.js"






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



userRouter.post('/forgot-password', validate({body:forgotPasswordBodySchema}),forgotPassword)

userRouter.post('/reset-password/:resetToken',validate({body:resetPasswordBodySchema, params:resetPasswordParamsSchema}),resetPassword)


userRouter.get('/get-user-data',userMiddleware,getUser)


userRouter.post('/add-new-address',userMiddleware,validate({
    body: addAddressBodySchema
 }),addAddress)

userRouter.get('/all-address' , userMiddleware , getAllAddress)



 userRouter.delete('/delete-address/:addressId',userMiddleware,validate({
    params: deleteAddressParamsSchema
 }),deleteAddress)


 userRouter.put('/edit-address/:addressId',userMiddleware,validate({
    body: editAddressBodySchema, params:editAddressParamsSchema
 }),editAddress)







export default userRouter