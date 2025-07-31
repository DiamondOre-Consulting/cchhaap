import {z} from "zod"


export const addToWishlistParamsSchema = z.object({
    productId : z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ID format" }),
})

export const removeFromWishlistParamsSchema = z.object({
    productId : z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ID format" }),
})

export const getAllWishlistProductsParamsSchema = z.object({
     limit:z.string().min(1,"Limit is missing"),
     page:z.string().min(1,"page number is missing")
})