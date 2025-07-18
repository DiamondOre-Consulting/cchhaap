import {Router} from 'express';
import { createCategory, createSubCategory, deleteCategory, deleteSubCategory, editCategory, editSubCategory, getAllCategories } from '../controllers/category.controller.js';
import { singleImageUpload } from '../middlewares/multer.middleware.js';
import validate from '../middlewares/zod.validator.js';
import { createCategoryBodySchema, createSubCategoryBodySchema, createSubCategoryParamsSchema, deleteCategoryParamsSchema, deleteSubCategoryBodySchema, deleteSubCategoryParamsSchema, editCategoryBodySchema, editCategoryParamsSchema, editSubCategoryBodySchema, editSubCategoryParamsSchema } from '../validator/category.validator.js';
import { signin, signout, signup } from '../controllers/auth/admin.auth.js';
import { signinSchema, signupSchema } from '../validator/admin.auth.validator.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';



















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






export default adminRouter