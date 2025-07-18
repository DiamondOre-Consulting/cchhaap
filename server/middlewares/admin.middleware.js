import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import Admin from '../models/admin.model.js';

export const adminMiddleware = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        throw new ApiError("Access Token is missing", 401);
    }

    const decodedToken = jwt.verify(accessToken, process.env.ADMIN_SECRET_KEY);
    const admin = await Admin.findById(decodedToken.id).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');

    if (!admin) {
        throw new ApiError("Admin not found", 401);
    }

    req.user = admin;
    next();
});