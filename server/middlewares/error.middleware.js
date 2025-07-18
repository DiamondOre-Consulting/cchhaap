import ApiError from "../utils/apiError.js"

const errorMiddleware = (err, req, res, next) => {
    let error = err

     if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      message: "Only one image is allowed. Please upload a single file.",
    });
    }

    if (!(error instanceof ApiError)){
        const message = error.message || "Something went wrong!"
        error = new ApiError(message, 500)
    }

    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack })
    }
    console.log(error)
    return res.status(error.statusCode).json(response)
}

export default errorMiddleware