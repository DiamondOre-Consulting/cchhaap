import {z} from "zod";



const categoryNameSchema = z.object({
    categoryName : z.string().min(2, "Category name is required")
})

const categoryIdSchema = z.object({
    categoryId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ID format" }),
});

export const deleteCategoryParamsSchema = categoryIdSchema

export const createCategoryBodySchema= categoryNameSchema;

export const editCategoryParamsSchema = categoryIdSchema

export const editCategoryBodySchema=z.object({
    categoryName : z.string().min(2, "Category name is required")
}).optional();






export const createSubCategoryParamsSchema = categoryIdSchema

 const subCategoryNameSchema = z.object({
    subCategoryName : z.string().min(2, "Sub category name is required")
})

export const createSubCategoryBodySchema = subCategoryNameSchema

export const deleteSubCategoryBodySchema = subCategoryNameSchema

export const deleteSubCategoryParamsSchema = categoryIdSchema


export const editSubCategoryBodySchema = z.object({
    oldSubCategoryName : z.string().min(2, "Old sub category name is required"),
    newSubCategoryName : z.string().min(2, "New sub category name is required"),
    indexOfOldCategory: z.number().min(0,"Invalid index"),
})



export const editSubCategoryParamsSchema = categoryIdSchema
