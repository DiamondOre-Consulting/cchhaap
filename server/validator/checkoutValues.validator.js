import {z} from "zod";



export const buyNowCheckoutValuesParamsSchema = z.object({
    productId : z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ID format" }),
    quantity: z.string().nonempty("Product quantity is missing"),
    variationId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid variation ID format" }).optional(),
})