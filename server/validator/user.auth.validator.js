import { z } from "zod";

export const userSignupBodySchema = z.object({
    email : z.string().email().trim(),
    password : z.string().min(6).trim(),
    otp: z.string()
  .min(6, { message: "OTP is too short, it must be 6 digits." })
  .max(6, { message: "OTP is too long, it must be 6 digits." })
});

export const userSendOtpBodySchema = z.object({
    email : z.string().email().trim(),
})

export const userSigninBodySchema = z.object({
    email : z.string().email().trim(),
    password : z.string().min(6).trim(),
})
