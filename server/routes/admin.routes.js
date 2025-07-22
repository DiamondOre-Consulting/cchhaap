import {Router} from 'express';
import { createCategory, createSubCategory, deleteCategory, deleteSubCategory, editCategory, editSubCategory, getAllCategories } from '../controllers/category.controller.js';
import { singleImageUpload } from '../middlewares/multer.middleware.js';
import validate from '../middlewares/zod.validator.js';
import { createCategoryBodySchema, createSubCategoryBodySchema, createSubCategoryParamsSchema, deleteCategoryParamsSchema, deleteSubCategoryBodySchema, deleteSubCategoryParamsSchema, editCategoryBodySchema, editCategoryParamsSchema, editSubCategoryBodySchema, editSubCategoryParamsSchema } from '../validator/category.validator.js';
import { signin, signout, signup } from '../controllers/auth/admin.auth.js';
import { signinSchema, signupSchema } from '../validator/admin.auth.validator.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { createCoupon, deleteCoupon, editCoupon, getAllCoupons } from '../controllers/coupon.controller.js';
import { createCouponSchema, deleteCouponParamsSchema, editCouponBodySchema, editCouponParamsSchema } from '../validator/coupon.validator.js';
import { createAttributeDefinition } from '../controllers/attributeDefinition.controller.js';
import { createAttributeDefinitionSchema } from '../validator/attributeDefinition.validator.js';






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



adminRouter.post('/create-attribute-definition',adminMiddleware,validate({body:createAttributeDefinitionSchema}),createAttributeDefinition)




export default adminRouter