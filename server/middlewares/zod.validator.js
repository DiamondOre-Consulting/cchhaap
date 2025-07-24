
import { z } from "zod";

// Clean only null-prototype objects, not arrays
const deepClean = (value) => {
  if (Array.isArray(value)) {
    return value.map(deepClean);
  } else if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepClean(v)])
    );
  }
  return value;
};

const validate = (schemas) => (req, res, next) => {
  try {
    if (!schemas.body || typeof schemas.body.parse !== 'function') {
      throw new Error("Missing or invalid Zod schema for body");
    }

    // Deep clean and preprocess the body
    let body = req.body;
    
    // console.log("Preprocessed body:", JSON.stringify(body, null, 2));

    // const validatedData = {
    //   body: schemas.body.parse(body)
    // };
  
     if (schemas.body) validatedData.body = schemas.body.parse(req.body);
    if (schemas.params) validatedData.params = schemas.params.parse(req.params);
    if (schemas.query) validatedData.query = schemas.query.parse(req.query);

    req.validatedData = validatedData;
    next();
  } catch (error) {
    console.error("Validation error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors ? error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        })) : [error.message]
      });
    }
    
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error during validation"
    });
  }
};

export default validate;