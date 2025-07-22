import { asyncHandler } from "../utils/asyncHandler.js"
import sendResponse from "../utils/sendResponse.js"
import ApiError from "../utils/apiError.js"
import { fileDestroy, fileUpload } from "../utils/fileUpload.js"
import AttributeDefinition from "../models/attributeDefinition.model.js"
import Category from "../models/category.model.js"









export const createAttributeDefinition = asyncHandler(async (req, res) => {
  const { category, attributes } = req.validatedData.body;
  


  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    throw new ApiError("Category not found", 404);
  }

  
  const existingAttributeDefinition = await AttributeDefinition.findOne({ category });
  if (existingAttributeDefinition) {
    throw new ApiError("Attribute definition already exists for this category", 400);
  }

  
  const newAttributeDefinition = await AttributeDefinition.create({
    category: category,
    attributes
  });

  
  sendResponse(res, 200, newAttributeDefinition, "Attribute definition created");
});



