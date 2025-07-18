


// import { sendMail } from "../utils/mail.utils.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"; 
import Admin from "../../models/admin.model.js";
import ApiError from "../../utils/apiError.js";
import sendResponse from "../../utils/sendResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";



const cookieOptions = {
  httpOnly: true,
  // secure: true,
  sameSite: "Lax",
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
    $or: [{ email }, { phoneNumber }],
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

  res.cookie("accessToken", token, cookieOptions);
  res.cookie("refreshAccessToken", refreshAccessToken, cookieOptions);

  sendResponse(res, 200, admin, "User created successfully");
});

export const signout = asyncHandler(async(req, res) => {
  const cookieOptions = {
    maxAge: new Date(),
    http: true,
    secure: false,
    sameSite: "None",
  };

  for (let cookie in req.cookies) {
    res.clearCookie(cookie, cookieOptions);
  }

  sendResponse(res, 200, null, "Signed out successfully");
});
