import {Router} from 'express';
import { createCategory, createSubCategory, deleteCategory, deleteSubCategory, editCategory, editSubCategory, getAllCategories } from '../controllers/category.controller.js';
import { multipleImageUpload, singleImageUpload } from '../middlewares/multer.middleware.js';
import validate from '../middlewares/zod.validator.js';
import { createCategoryBodySchema, createSubCategoryBodySchema, createSubCategoryParamsSchema, deleteCategoryParamsSchema, deleteSubCategoryBodySchema, deleteSubCategoryParamsSchema, editCategoryBodySchema, editCategoryParamsSchema, editSubCategoryBodySchema, editSubCategoryParamsSchema } from '../validator/category.validator.js';
import { forgotPassword, getAdmin, resetPassword, signin, signout, signup } from '../controllers/auth/admin.auth.js';
import { signinSchema, signupSchema } from '../validator/admin.auth.validator.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { createCoupon, deleteCoupon, editCoupon, getAllCoupons } from '../controllers/coupon.controller.js';
import { createCouponSchema, deleteCouponParamsSchema, editCouponBodySchema, editCouponParamsSchema } from '../validator/coupon.validator.js';
import { createAttributeDefinition, deleteAttributeDefinition, editAttributeDefinition, getAllAttributeDefinition, getSingleAttributeDefinition } from '../controllers/attributeDefinition.controller.js';
import { createAttributeDefinitionSchema, editAttributeDefinitionBodySchema, getAttributeDefinitionParamsSchema } from '../validator/attributeDefinition.validator.js';
import { createProductBodySchema, deleteProductParamsSchema, getAdminAllProductsParamsSchema } from '../validator/admin.product.validator.js';
import { createProduct, deleteProduct, editProduct, getAdminAllProducts, getAdminSingleProduct } from '../controllers/admin.product.controller.js';
import { addBannerImage, editBannerImages, getAllBanners } from '../controllers/banner.controller.js';
import { searchProduct } from '../controllers/user.miscellaneous.controller.js';
import { searchProductParamsSchema } from '../validator/user.product.validator.js';
import { approveExchangeRequest, changeOrderStatus, fetchAllOrdersForAdmin } from '../controllers/order.admin.controller.js';
import { approveExchangeRequestParamsSchema, changeOrderStatusBodySchema, fetchAllOrdersForAdminSchema, getSingleOrderQuerySchema } from '../validator/order.validator.js';
import { fetchAllUsers, getSalesDashboardData, getSalesData, getUser, searchProductForAdmin } from '../controllers/admin.miscellaneous.controller.js';
import { getLineChartSalesDataQuerySchema, getSalesDataParamsData, getSalesDataQuerySchema, getSingleUserForAdminParamsSchema } from '../validator/admin.miscellaneous.js';
import { forgotPasswordBodySchema, resetPasswordBodySchema, resetPasswordParamsSchema, userSendOtpBodySchema } from '../validator/user.auth.validator.js';
import {  sendOtp } from '../controllers/auth/user.auth.js';








const adminRouter = Router()



adminRouter.post('/create-category',singleImageUpload.single("categoryImage"),validate({body:createCategoryBodySchema}),createCategory)

adminRouter.get('/get-all-categories',getAllCategories)


adminRouter.put('/edit-category/:categoryId',singleImageUpload.single("categoryImage"),validate({body:editCategoryBodySchema, params:editCategoryParamsSchema}),editCategory)

adminRouter.delete('/delete-category/:categoryId',validate({params:deleteCategoryParamsSchema}),deleteCategory)


adminRouter.post('/signin'  , validate({body:signinSchema}), signin)

adminRouter.post('/signup',adminMiddleware ,validate({body:signupSchema}),signup)

adminRouter.get('/signout',signout)



adminRouter.post('/create-sub-category/:categoryId',validate({body:createSubCategoryBodySchema, params:createSubCategoryParamsSchema}),createSubCategory)

adminRouter.delete('/delete-sub-category/:categoryId',validate({body:deleteSubCategoryBodySchema, params:deleteSubCategoryParamsSchema}),deleteSubCategory)

adminRouter.put('/edit-sub-category/:categoryId',validate({body:editSubCategoryBodySchema, params:editSubCategoryParamsSchema}),editSubCategory)


adminRouter.post('/create-coupon-code',validate({body:createCouponSchema}),createCoupon)


adminRouter.get('/get-all-coupons',getAllCoupons);


adminRouter.delete('/delete-coupon-code/:couponId',validate({params:deleteCouponParamsSchema}),deleteCoupon)


adminRouter.put('/edit-coupon-code/:couponId',validate({body:editCouponBodySchema, params:editCouponParamsSchema}),editCoupon)


adminRouter.post('/create-attribute-definition',validate({body:createAttributeDefinitionSchema}),createAttributeDefinition)

adminRouter.get('/get-single-attribute-definition/:category',validate({params:getAttributeDefinitionParamsSchema}),getSingleAttributeDefinition)

adminRouter.get('/get-all-attribute-definition',getAllAttributeDefinition)

adminRouter.delete('/delete-attribute-definition/:category',validate({params:getAttributeDefinitionParamsSchema}),deleteAttributeDefinition)


adminRouter.put('/edit-attribute-definition/:category',validate({body:editAttributeDefinitionBodySchema, params:getAttributeDefinitionParamsSchema}),editAttributeDefinition)



adminRouter.post("/add-new-product",multipleImageUpload.any(),createProduct);

adminRouter.delete('/delete-product/:productId',validate({params:deleteProductParamsSchema}),deleteProduct)


adminRouter.get('/get-all-product/:limit/:page',validate({
    params:getAdminAllProductsParamsSchema
}),getAdminAllProducts)

adminRouter.get('/get-single-product/:productId',validate({params:deleteProductParamsSchema}),getAdminSingleProduct)


adminRouter.put("/edit-product/:productId",multipleImageUpload.any(),editProduct);




adminRouter.post('/add-banner-images',multipleImageUpload.array('bannerImages'),adminMiddleware,addBannerImage)



adminRouter.get('/get-all-banners',adminMiddleware,getAllBanners)



adminRouter.put('/edit-banner-images',multipleImageUpload.array('bannerImages'),adminMiddleware,editBannerImages)




 adminRouter.get('/search-product/:searchTerm',validate({
    params:searchProductParamsSchema
 }),searchProductForAdmin)


 adminRouter.get('/get-all-orders-for-admin/:page/:limit',adminMiddleware,validate({
    params:fetchAllOrdersForAdminSchema, query:getSingleOrderQuerySchema
 }),fetchAllOrdersForAdmin)



 adminRouter.get('/get-single-user/:userId',adminMiddleware,validate({
    params:getSingleUserForAdminParamsSchema
 }),getUser)


 adminRouter.get('/get-sales-data',adminMiddleware,validate({
     query: getSalesDataQuerySchema
 }),getSalesData)


 adminRouter.post('/change-order-status',adminMiddleware,validate({
     body:changeOrderStatusBodySchema
 }),changeOrderStatus)


 adminRouter.get('/fetch-all-users/:page/:limit',adminMiddleware,
    validate({params:getSalesDataParamsData}),fetchAllUsers)



adminRouter.post('/send-otp',validate({
   body:userSendOtpBodySchema
}),sendOtp)



adminRouter.post('/reset-password/:resetToken',validate({
   body:resetPasswordBodySchema, params:resetPasswordParamsSchema
}),resetPassword)


adminRouter.post('/forgot-password', validate({body:forgotPasswordBodySchema}),forgotPassword)


adminRouter.get('/get-line-chart-sales-data',validate({query:getLineChartSalesDataQuerySchema}),adminMiddleware,getSalesDashboardData)


adminRouter.get('get-admin',adminMiddleware,getAdmin)


adminRouter.put('/approve-exchange-request/:orderId/:variationId',adminMiddleware,validate({
    params:approveExchangeRequestParamsSchema
}),approveExchangeRequest)









 







export default adminRouter