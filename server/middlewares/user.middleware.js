import jwt from 'jsonwebtoken';
import {asyncHandler} from '../utils/asyncHandler.js';
import ApiError from '../utils/apiError.js';
import User from '../models/user.model.js';



export const userMiddleware = asyncHandler(async(req,res,next)=>{
    
    let accessToken = req.cookies.accessToken

    // Fallback: allow Authorization header Bearer token for environments where third-party cookies are blocked
    if (!accessToken && req.headers.authorization?.startsWith('Bearer ')) {
        accessToken = req.headers.authorization.split(' ')[1];
    }

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