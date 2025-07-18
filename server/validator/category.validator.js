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
