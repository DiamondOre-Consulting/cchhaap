import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";
import ApiError from "../../utils/apiError.js";
import sendResponse from "../../utils/sendResponse.js";
import { sendMail } from "../../utils/mail.util.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Cart from "../../models/cart.model.js";
import crypto from "crypto"; 
import Address from "../../models/address.model.js";







const otpStore = new Map()

const cookieOptions = {
  httpOnly: true,
  secure: true,           // prod
  sameSite: "None",       // cross-site
  path: "/",              // IMPORTANT: make it explicit
  // domain: "your.domain.com", // ONLY if you also used this when setting
};




export const signup= asyncHandler(async(req,res)=>{

    const {email,password,otp} = req.validatedData.body
    
    const existingUser = await User.findOne({email})

    if(existingUser){
       throw new ApiError("User already exist",400)
    }

    const hashedPassword = await bcrypt.hash(password, 10);
   
    const storedOtp = otpStore.get(email);
    
    if(!storedOtp){
        throw new ApiError("Otp is missing",400)
    }

    if(storedOtp.otp!==otp){
        throw new ApiError("Otp entered is not matching",400)
    }

     const user = await User.create({
        email,
        password: hashedPassword
      });
      
      otpStore.delete(email);
          
      const token = await user.generateAccessToken();
      const refreshAccessToken = await user.generateRefreshToken();
      user.refreshAccessToken = refreshAccessToken;

      const cart = await Cart.create({
        userId:user._id
      })
      user.cart = cart._id

      await user.save();
    
      user.password = undefined;
      user.refreshAccessToken = undefined;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
    
      res.cookie("accessToken", token, cookieOptions);
      res.cookie("refreshAccessToken", refreshAccessToken, cookieOptions);

      sendResponse(res, 200, user, "User created successfully")

})

export const sendOtp = asyncHandler(async(req,res)=>{

    const {email} = req.validatedData.body

   
    const existingUser = await User.findOne({email})

    if(existingUser){
       throw new ApiError("User already exist",400)
    }

    const generatedOTP = () => {
        return randomUUID().replace(/\D/g, '').slice(0, 6);
    };

    const otp=generatedOTP()

    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    console.log(otpStore)

   const emailTemplate = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 30px; border-radius: 8px; text-align: center;">
        <!-- Header with Brand Logo/Name -->
        <h1 style="color: #000; font-weight: 300; letter-spacing: 2px; margin-bottom: 10px;">CHHAAP</h1>
        <p style="color: #888; font-size: 14px; margin-top: 0; letter-spacing: 1px;">Elevate Your Style</p>
        
        <!-- Divider -->
        <div style="border-top: 1px solid #e0e0e0; margin: 20px 0;"></div>
        
        <!-- Greeting -->
        <p style="color: #333; font-size: 16px; margin-bottom: 25px;">Hello Fashion Enthusiast,</p>
        
        <!-- OTP Section -->
        <p style="color: #555; font-size: 15px;">Your One-Time Password (OTP) for verification is:</p>
        <div style="background-color: #fff; border: 1px dashed #d0d0d0; padding: 15px; display: inline-block; margin: 15px 0; border-radius: 4px;">
            <h2 style="color: #000; margin: 0; letter-spacing: 3px; font-weight: 500;">${otp}</h2>
        </div>
        
        <!-- Validity Note -->
        <p style="color: #777; font-size: 14px; font-style: italic;">This OTP is valid for 5 minutes.</p>
        <p style="color: #ff5252; font-size: 13px;">⚠️ Do not share this code with anyone.</p>
        
        <!-- Footer -->
        <div style="border-top: 1px solid #e0e0e0; margin: 25px 0 15px; padding-top: 15px;">
            <p style="color: #888; font-size: 14px;">Thank you for choosing <strong>Chhaap</strong>.</p>
            <p style="color: #aaa; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
        </div>
        
        <!-- Social Media Links (Optional) -->
        <div style="margin-top: 20px;">
            <a href="#" style="margin: 0 5px; text-decoration: none; color: #000; font-size: 12px;">Instagram</a>
            <span>•</span>
            <a href="#" style="margin: 0 5px; text-decoration: none; color: #000; font-size: 12px;">Website</a>
            <span>•</span>
            <a href="#" style="margin: 0 5px; text-decoration: none; color: #000; font-size: 12px;">Contact Us</a>
        </div>
    </div>
`;

   await sendMail(email, "OTP for signup", emailTemplate);

   

   sendResponse(res,200,null,"Otp sent successfully")


})

export const signin= asyncHandler(async(req,res)=>{

    const {email,password} = req.validatedData.body

    const existingUser = await User.findOne({email}).select('+password')
    
    if (!existingUser) {
        throw new ApiError("User not found", 422);
    }

    const passwordCheck = await existingUser.comparePassword(password);

    if (!passwordCheck) {
        throw new ApiError("Password is incorrect", 409);
    }


    const accessToken = await existingUser.generateAccessToken();
    const refreshAccessToken = await existingUser.generateRefreshToken();
    existingUser.refreshAccessToken = refreshAccessToken;
    await existingUser.save();

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshAccessToken", refreshAccessToken, cookieOptions);
    existingUser.password = undefined;
    existingUser.refreshAccessToken = undefined;
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordTokenExpires = undefined;

    sendResponse(res, 200, existingUser, "User logged in successfully");


})


export const signout = asyncHandler(async (req, res) => {
  // Use the same cookie options as when the cookies were set
  const cookieOptionsForSignOut = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  };

  // Use the identical options to clear the cookies.
  res.clearCookie("accessToken", cookieOptionsForSignOut);
  res.clearCookie("refreshAccessToken", cookieOptionsForSignOut);

  sendResponse(res, 200, null, "Signed out successfully");
});




export const resetPassword = asyncHandler(async(req,res)=>{
 
    const {resetToken} = req.validatedData.params;
    let {newPassword} = req.validatedData.body;
    
    const existingUser = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordTokenExpires: { $gt: Date.now() },
    }).select('+password');

    if(!existingUser){ 
        throw new ApiError("Token expired",400)
    }

    newPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = newPassword;
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordTokenExpires = undefined;

    await existingUser.save();

    sendResponse(res, 200, null, "Password reset successfully");


})





export const getUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const existingUser = await User.findById(userId)
        .select("_id fullName email phoneNumber createdAt updatedAt address wishList cart")
        .populate("address wishList cart");
     
        // console.log(existingUser)

    if (!existingUser) {
        throw new ApiError("User not found", 400);
    }

    sendResponse(res, 200, existingUser, "User fetched successfully");
});












export const editProfile = asyncHandler(async(req,res)=>{

    const userId = req.user.id;

    const {phoneNumber}= req.validatedData.body
   

    // if (req.validatedData.body.userAddresses) {
    //     const defaultCount = req.validatedData.body.userAddresses.filter(addr => addr.isDefault).length;
    //     if (defaultCount > 1) {
    //         throw new ApiError("Only one address can be marked as default", 400);
    //     }
    // }

    const sameUserWithSamePhoneNumber = await User.findOne({
      phoneNumber,
      _id: { $ne: userId } 
    });
    
    if (sameUserWithSamePhoneNumber) {
      throw new ApiError("Phone number is already associated with someone else's account", 400);
    }
    const existingUser = await User.findById(userId)

    Object.assign(existingUser, req.validatedData.body);


    await existingUser.save()
    
    sendResponse(res,200,null,"user updated successfully") 

})





export const editAddress = asyncHandler(async(req,res)=>{
    const userId = req.user.id
    const address = await Address.findOne({userId})
    if (!address) return sendResponse(res, 404, null, "Address not found");

    const addressIndex = address.addresses.findIndex((addr) => addr._id.toString() === req.validatedData.params.addressId);
    if(addressIndex<0){
        throw new ApiError("Address not found",400)
    }

    if(req.validatedData.body.isDefault){
        address.addresses.forEach(addr => addr.isDefault=false);
    }
    Object.assign(address.addresses[addressIndex],req.validatedData.body)   
    await address.save()
    sendResponse(res,200,address,"Address updated successfully")
})



export const deleteAddress = asyncHandler(async(req,res)=>{
    const userId = req.user.id
    const address = await Address.findOne({userId})
    const addressIndex = address.addresses.findIndex((addr) => addr._id.toString() === req.validatedData.params.addressId);
    if(addressIndex<0){
        throw new ApiError("Address not found",400)
    }
    address.addresses.splice(addressIndex,1)
    await address.save()
    sendResponse(res,200,address,"Address deleted successfully")
})



export const getAllAddress = asyncHandler(async(req,res)=>{
    const userId = req.user.id
   
    const address = await Address.findOne({userId});
console.log("address",address)
    if(address?.length === 0){
      throw new ApiError("no address found" , 400)
    }

    sendResponse(res,200,address , "address fetched successfully")
})






export const forgotPassword = asyncHandler(async(req, res)=>{
    const { email } = req.validatedData.body;
  
    const existingUser = await User.findOne({ email });
  
    if (!existingUser) {
      throw new ApiError("User not found", 400);
    }
  
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
    const expiryTime = encodeURIComponent(resetPasswordTokenExpires)
  
    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordTokenExpires = resetPasswordTokenExpires;
  
    await existingUser.save();
  
  
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}/${existingUser.email}/${expiryTime}`;
  
    const emailTemplate = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              h1 {
                color: #333;
                font-size: 24px;
                text-align: center;
              }
              p {
                font-size: 16px;
                line-height: 1.5;
                color: #555;
              }
              .button {
                display: inline-block;
                background-color: #4CAF50;
                color: #fff;
                padding: 12px 20px;
                text-align: center;
                font-size: 18px;
                border-radius: 4px;
                text-decoration: none;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                font-size: 14px;
                color: #777;
                margin-top: 30px;
              }
              .footer a {
                color: #4CAF50;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Password Reset Request</h1>
              <p>Hi there,</p>
              <p>We received a request to reset your password. Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If you didn't request a password reset, please ignore this email or let us know.</p>
              <p>Thank you,</p>
              <p>The Team</p>
            </div>
            <div class="footer">
              <p>If you have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
            </div>
          </body>
        </html>
        `;
  
    await sendMail(email, "Reset Password", emailTemplate);
    sendResponse(res, 200, null, "Password reset email sent successfully");
});



export const addAddress = asyncHandler(async(req,res)=>{
      
       const userId = req.user.id
       const address = await Address.findOne({userId})      
       if(!address){
        const newAddress=await Address.create({userId,addresses:[req.validatedData.body]})
        sendResponse(res,200,newAddress,"Address added successfully")
       }else{
        if(req.validatedData.body.isDefault){
            const defaultCount = address.addresses.forEach(addr => addr.isDefault=false);
            if (defaultCount > 1) {
                throw new ApiError("Only one address can be marked as default", 400);
            }
        }
        address.addresses.push(req.validatedData.body)
        await address.save()
        sendResponse(res,200,address,"Address added successfully")
       }
})


