import {Router} from 'express';
import { createCategory, createSubCategory, deleteCategory, deleteSubCategory, editCategory, editSubCategory, getAllCategories } from '../controllers/category.controller.js';
import { multipleImageUpload, singleImageUpload } from '../middlewares/multer.middleware.js';
import validate from '../middlewares/zod.validator.js';
import { createCategoryBodySchema, createSubCategoryBodySchema, createSubCategoryParamsSchema, deleteCategoryParamsSchema, deleteSubCategoryBodySchema, deleteSubCategoryParamsSchema, editCategoryBodySchema, editCategoryParamsSchema, editSubCategoryBodySchema, editSubCategoryParamsSchema } from '../validator/category.validator.js';
import { signin, signout, signup } from '../controllers/auth/admin.auth.js';
import { signinSchema, signupSchema } from '../validator/admin.auth.validator.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { createCoupon, deleteCoupon, editCoupon, getAllCoupons } from '../controllers/coupon.controller.js';
import { createCouponSchema, deleteCouponParamsSchema, editCouponBodySchema, editCouponParamsSchema } from '../validator/coupon.validator.js';
import { createAttributeDefinition, deleteAttributeDefinition, editAttributeDefinition, getAllAttributeDefinition, getSingleAttributeDefinition } from '../controllers/attributeDefinition.controller.js';
import { createAttributeDefinitionSchema, editAttributeDefinitionBodySchema, getAttributeDefinitionParamsSchema } from '../validator/attributeDefinition.validator.js';
import { createProductBodySchema, deleteProductParamsSchema, getAdminAllProductsParamsSchema } from '../validator/admin.product.validator.js';
import { createProduct, deleteProduct, getAdminAllProducts, getAdminSingleProduct } from '../controllers/admin.product.controller.js';






const adminRouter = Router()



adminRouter.post('/create-category',singleImageUpload.single("categoryImage"),validate({body:createCategoryBodySchema}),createCategory)

adminRouter.get('/get-all-categories',getAllCategories)


adminRouter.put('/edit-category/:categoryId',singleImageUpload.single("categoryImage"),validate({body:editCategoryBodySchema, params:editCategoryParamsSchema}),editCategory)

adminRouter.delete('/delete-category/:categoryId',validate({params:deleteCategoryParamsSchema}),deleteCategory)


adminRouter.post('/signin'  , validate({body:signinSchema}), signin)

adminRouter.post('/signup', validate({body:signupSchema}),signup)

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













export default adminRouter