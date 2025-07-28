import {Router} from "express"
import { addAddress, deleteAddress, editAddress, forgotPassword, getAllAddress, getUser, resetPassword, sendOtp, signin, signout, signup } from "../controllers/auth/user.auth.js"
import { forgotPasswordBodySchema, resetPasswordBodySchema, resetPasswordParamsSchema, userSendOtpBodySchema, userSigninBodySchema, userSignupBodySchema } from "../validator/user.auth.validator.js"
import validate from "../middlewares/zod.validator.js"
import { userMiddleware } from "../middlewares/user.middleware.js"
import { addAddressBodySchema, deleteAddressParamsSchema, editAddressBodySchema, editAddressParamsSchema } from "../validator/address.validator.js"
import { removeItemFromCartParamsSchema, updateCartParamsSchema } from "../validator/cart.validator.js"
import { getCart, removeItemFromCart, updateCart } from "../controllers/cart.controller.js"
import { createOrder } from "../controllers/order.controller.js"
import { createOrderBodySchema, createOrderQuerySchema } from "../validator/order.validator.js"
import { getAdminAllProducts, getAdminSingleProduct } from "../controllers/admin.product.controller.js"
import { deleteProductParamsSchema, getAdminAllProductsParamsSchema } from "../validator/admin.product.validator.js"






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




userRouter.put('/update-cart/:quantity/:productId/:variationId',userMiddleware,validate({
     params:updateCartParamsSchema
}),updateCart)



 userRouter.get("/get-cart",userMiddleware,getCart)



 userRouter.put('/remove-item-from-cart/:productId',userMiddleware,validate({
    params:removeItemFromCartParamsSchema
}),removeItemFromCart)


 userRouter.post('/create-order',userMiddleware,validate({
      query: createOrderQuerySchema,
      body: createOrderBodySchema
 }),createOrder) 



 userRouter.get('/get-all-product/:limit/:page',validate({
   params:getAdminAllProductsParamsSchema
}),getAdminAllProducts)

userRouter.get('/get-single-product/:productId',validate({params:deleteProductParamsSchema}),getAdminSingleProduct)
















export default userRouter