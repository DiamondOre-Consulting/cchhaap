import { z } from "zod";

export const getUserSingleProductParamsSchema = z.object({
    productId: z.string().min(1, "Product ID is required"),
});

export const getSingleProductQuerySchema = z.object({
  userId: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  variationId: z.string().optional(),
});



export const getCategorizedProductsParamsSchema = z.object({
    categoryId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ID format" }),
})

export const getCategorizedProductsQuerySchema = z.object({
    userId:  z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid category ID format" }).optional(),
})


export const getProductsByGenderParamsSchema = z.object({

    gender: z.enum(["Men", "Women", "Unisex", "Kids"], {
      required_error: "Gender is required",
      invalid_type_error: "Gender must be either Men, Women, Unisex or Kids"
    })
});


export const getProductsByGenderQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1), // Convert to number, must be positive integer
    limit: z.coerce.number().int().positive().max(100).default(10), // Max 100 items per page
    userId: z.string().optional()
})



export const getFeaturedProductsQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1), // Convert to number, must be positive integer
    limit: z.coerce.number().int().positive().max(100).default(10), // Max 100 items per page
    userId: z.string().optional()
})










