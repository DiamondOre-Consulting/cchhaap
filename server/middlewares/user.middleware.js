import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';



export const userMiddleware = asyncHandler(async(req,res,next)=>{
    
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        throw new ApiError("Access Token is missing", 401);
    }

  

    
    const decodedToken = jwt.verify(accessToken, process.env.USER_SECRET_KEY);
    
    const user = await User.findById(decodedToken.id).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires');
   

    if (!user) {
        throw new ApiError("User not found", 401);
    }

    req.user = user;
    next();
    

})