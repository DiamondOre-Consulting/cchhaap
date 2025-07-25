import {z} from "zod"


export const addAddressBodySchema = z.object({
    fullName : z.string().min(2, "Name is required"),
    phoneNumber: z.string().min(10, "Phone number must be 10 digits").max(10, "Phone number must be 10 digits").regex(/^[6-9]\d{9}$/, "Invalid phone number"),
    street : z.string().min(2, "Street is required"),
    city : z.string().min(2, "City is required"),
    state : z.string().min(2, "State is required"),
    country: z.string().refine((val)=>val==="India","Country must be India"),
    pinCode : z.string().min(6, "Pin Code is required").max(6),
    addressType : z.enum(["home", "work", "office"]).default("home"),
    isDefault : z.coerce.boolean().default(false),
})


export const deleteAddressParamsSchema = z.object({
    addressId : z
       .string()
       .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid address ID format" }), 
})



export const  editAddressBodySchema = z.object({
    fullName : z.string().optional(),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number").optional(),
    street : z.string().optional(),
    city : z.string().optional(),
    state : z.string().optional(),
    country: z.string().optional(),
    pinCode : z.string().optional(),
    addressType : z.enum(["home", "work", "office"]).default("home"),
    isDefault : z.coerce.boolean().optional(),
})


export const editAddressParamsSchema = z.object({
   addressId : z
       .string()
       .regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid address ID format" }),  
})