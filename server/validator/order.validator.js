import {z} from "zod"
 

export const createOrderBodySchema  = z.object({
    
  paymentStatus : z.enum(["paid", "unpaid", "refunded"]),
  paymentMethod: z.enum(["online", "cod"]),
  address: z.object({
    fullName: z.string().nonempty("Full name is required"),
    phoneNumber: z.string().min(10,"Phone number should be of at least 10 digits").max(10,"Phone number should be of at max 10 digits").nonempty("Phone number is required"),
    street: z.string().nonempty("Street is required"),
    city:z.string().nonempty("City is required"),
    state: z.string().nonempty("State is required"),
    pinCode: z.string().nonempty("Pin code  is required"),
    country:z.string().nonempty("Country is required").default("India")
  })
  

})

export const createOrderQuerySchema = z.object({
    couponCode : z.string().optional(),
    productId : z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid product ID format" }).optional(),
    variationId:z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid variation ID format" }).optional(),
    quantity: z.string().nonempty("Product quantity is missing").optional(),
})