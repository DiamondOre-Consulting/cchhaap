import {Router} from "express"
import { addAddress, deleteAddress, editAddress, forgotPassword, getAllAddress, getUser, resetPassword, sendOtp, signin, signout, signup } from "../controllers/auth/user.auth.js"
import { forgotPasswordBodySchema, resetPasswordBodySchema, resetPasswordParamsSchema, userSendOtpBodySchema, userSigninBodySchema, userSignupBodySchema } from "../validator/user.auth.validator.js"
import validate from "../middlewares/zod.validator.js"
import { userMiddleware } from "../middlewares/user.middleware.js"
import { addAddressBodySchema, deleteAddressParamsSchema, editAddressBodySchema, editAddressParamsSchema } from "../validator/address.validator.js"
import { removeItemFromCartParamsSchema, updateCartParamsSchema } from "../validator/cart.validator.js"
import { getCart, getNavbarCartAndWishlistCount, removeItemFromCart, updateCart } from "../controllers/cart.controller.js"
import { createOrder } from "../controllers/order.controller.js"
import { createOrderBodySchema, createOrderQuerySchema } from "../validator/order.validator.js"
import { getAdminAllProducts, getAdminSingleProduct } from "../controllers/admin.product.controller.js"
import { deleteProductParamsSchema, getAdminAllProductsParamsSchema } from "../validator/admin.product.validator.js"
import { getFeaturedProducts, getProductsByGender, getUserCategorizedProducts, getUserSingleProduct } from "../controllers/user.product.controller.js"
import { getCategorizedProductsParamsSchema, getCategorizedProductsQuerySchema, getFeaturedProductsQuerySchema, getProductsByGenderParamsSchema, getProductsByGenderQuerySchema, getSingleProductQuerySchema, getUserSingleProductParamsSchema } from "../validator/user.product.validator.js"
import { addToWishlist, getAllWishlistProducts, removeFromWishlist } from "../controllers/wishlist.controller.js"
import { addToWishlistParamsSchema, getAllWishlistProductsParamsSchema, removeFromWishlistParamsSchema } from "../validator/wishlist.validator.js"
import { getCheckoutValues } from "../controllers/checkout.controller.js"
import { getAllCategories } from "../controllers/category.controller.js"






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

userRouter.get('/get-single-product/:productId',validate({query:getSingleProductQuerySchema, params: getUserSingleProductParamsSchema}),getUserSingleProduct)








userRouter.post('/add-to-wishlist/:productId',userMiddleware,validate({
   params: addToWishlistParamsSchema
}),addToWishlist)

userRouter.post('/remove-from-wishlist/:productId',userMiddleware,validate({
    params: removeFromWishlistParamsSchema
 }),removeFromWishlist)

userRouter.get("/get-all-wishlist-products/:page/:limit",userMiddleware,validate({
    params: getAllWishlistProductsParamsSchema
}),getAllWishlistProducts)



 userRouter.get("/get-categorized-products/:categoryId",validate({
    params:getCategorizedProductsParamsSchema, query : getCategorizedProductsQuerySchema
 }),getUserCategorizedProducts)


 userRouter.get("/get-gender-based-products/:gender",validate({
    params:getProductsByGenderParamsSchema, query : getProductsByGenderQuerySchema
 }),getProductsByGender)



 userRouter.get('/get-featured-products',validate({
    query: getFeaturedProductsQuerySchema
 }),getFeaturedProducts)



 userRouter.get('/get-checkout-values',userMiddleware,getCheckoutValues)


 userRouter.get('/get-all-categories',getAllCategories)


 userRouter.get('/get-navbar-cart-wishlist-count',userMiddleware,getNavbarCartAndWishlistCount)
 










 















export default userRouter