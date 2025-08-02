import {z} from "zod";

export const createCouponSchema = z.object({
    couponCode : z.string().min(3, "Coupon name is required"),
    discountType : z.enum(["percentage", "fixed"]),
    startDate : z.preprocess(val => new Date(val), z.date()),
    endDate : z.preprocess(val => new Date(val), z.date()),
    minAmount : z.coerce.number().min(1, "Min amount is required"),
    discountValue : z.coerce.number().min(1, "Discount value is required"),
    isActive : z.coerce.boolean().default(true),
})

const couponIdSchema =  z.object({
    couponId : z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid coupon ID format" }),
});


export const deleteCouponParamsSchema =  couponIdSchema;


export const editCouponParamsSchema = couponIdSchema;


export const editCouponBodySchema = z.object({
    couponCode : z.string().optional(),
    discountType : z.enum(["percentage", "fixed"]).optional(),
    startDate : z.preprocess(val => new Date(val), z.date()).optional(),
    endDate : z.preprocess(val => new Date(val), z.date()).optional(),
    minAmount : z.coerce.number().min(0, "Min amount is required").optional(),
    discountValue : z.coerce.number().min(1, "Discount value is required").optional(),
    isActive : z.coerce.boolean().default(true).optional(),
})


export const applyCouponParamsSchema = z.object({
    couponCode: z.string().min(3).max(20).trim()
})

export const buyNowApplyCouponParamsSchema = z.object({
    couponCode: z.string().min(3).max(20).trim(),
    productId : z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ID format" }),
})
