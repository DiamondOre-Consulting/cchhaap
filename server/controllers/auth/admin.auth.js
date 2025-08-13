


// import { sendMail } from "../utils/mail.utils.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"; 
import Admin from "../../models/admin.model.js";
import ApiError from "../../utils/apiError.js";
import sendResponse from "../../utils/sendResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendMail } from "../../utils/mail.util.js";




// Build cookie options dynamically to avoid setting invalid domain on different hosts
const getCookieOptions = (req) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const configuredDomain = process.env.COOKIE_DOMAIN; // e.g., .chhaapp.in
  const host = req.hostname;
  const normalizedDomain = configuredDomain?.replace(/^\./, '');

  // Only set domain if current host is a subdomain of configured domain
  const shouldUseDomain = Boolean(normalizedDomain && host.endsWith(normalizedDomain));

  // If using same-site domain (subdomain), Lax is fine; otherwise use None for cross-site
  const sameSite = shouldUseDomain ? 'Lax' : 'None';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite,
    ...(shouldUseDomain ? { domain: configuredDomain } : {}),
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};


export const signin = asyncHandler(async(req, res) => {
  const { email, password } = req.validatedData.body;

  const existingUser = await Admin.findOne({ email }).select("+password");

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

  const cookieOptions = getCookieOptions(req);
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshAccessToken", refreshAccessToken, cookieOptions);
  existingUser.password = undefined;
  existingUser.refreshAccessToken = undefined;
  existingUser.resetPasswordToken = undefined;
  existingUser.resetPasswordTokenExpires = undefined;

  sendResponse(res, 200, existingUser, "User logged in successfully");
});

export const signup = asyncHandler(async(req, res) => {
  const { fullName, email, phoneNumber, password, role } = req.validatedData.body;
   
  if (req.user.role !== "superAdmin") {
    throw new ApiError("Only admin can create admin", 403);
  }

  const existedUser = await Admin.findOne({
    $and: [{ email }, { phoneNumber }],
  });

  if (existedUser) {
    throw new ApiError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await Admin.create({
    fullName,
    email,
    phoneNumber,
    password: hashedPassword,
    role,
  });

  const token = await admin.generateAccessToken();
  const refreshAccessToken = await admin.generateRefreshToken();
  admin.refreshAccessToken = refreshAccessToken;
  await admin.save();

  admin.password = undefined;
  admin.refreshAccessToken = undefined;
  admin.resetPasswordToken = undefined;
  admin.resetPasswordTokenExpires = undefined;

  const cookieOptions = getCookieOptions(req);
  res.cookie("accessToken", token, cookieOptions);
  res.cookie("refreshAccessToken", refreshAccessToken, cookieOptions);

  sendResponse(res, 200, admin, "User created successfully");
});

export const signout = asyncHandler(async(req, res) => {
  

  for (let cookie in req.cookies) {
    res.clearCookie(cookie, cookieOptions);
  }

  sendResponse(res, 200, null, "Signed out successfully");
});




export const resetPassword = asyncHandler(async(req,res)=>{
 
    const {resetToken} = req.validatedData.params;
    let {newPassword} = req.validatedData.body;
    
    const existingUser = await Admin.findOne({
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


export const forgotPassword = asyncHandler(async(req, res)=>{
    const { email } = req.validatedData.body;
  
    const existingUser = await Admin.findOne({ email });
  
    if (!existingUser) {
      throw new ApiError("User not found", 400);
    }
  
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
    const expiryTime = encodeURIComponent(resetPasswordTokenExpires)
  
    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordTokenExpires = resetPasswordTokenExpires;
  
    await existingUser.save();
  
  
    const resetUrl = `http://admin.chhaapp.in/reset-password/${resetToken}/${existingUser.email}/${expiryTime}`;
  
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




export const getAdmin = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const admin = await Admin.findById(userId)
    .select("-password -resetPasswordToken -resetPasswordTokenExpires")
    .lean();

  if (!admin) {
    throw new ApiError("Admin not found", 404);
  }

  sendResponse(res, 200, admin, "Admin fetched successfully");
});
