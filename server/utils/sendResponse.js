import { ApiResponse } from './apiResponse.js';

const sendResponse = (res, statusCode, data = null, message = "Success") => {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
};

export default sendResponse;