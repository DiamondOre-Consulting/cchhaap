
import { asyncHandler } from "../utils/asyncHandler.js";

import Product from "../models/product.model.js";
import sendResponse from "../utils/sendResponse.js";
import ApiError from "../utils/apiError.js";




export const searchProduct = asyncHandler(async (req, res) => {
  const { searchTerm } = req.validatedData.params;

  if (!searchTerm) {
    throw new ApiError("Search term is required", 400);
  }

  const products = await Product.aggregate([
    {
      $search: {
        index: "products_search_index",
        text: {
          query: searchTerm,
          path: "productName",
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    {
      $addFields: {
        score: { $meta: "textScore" },
      },
    },
    {
      $unwind: "$variations", // flatten variations
    },
    {
      $project: {
        productName: 1,
        _id: 1,
        score: 1,
        "thumbnailImage": "$variations.thumbnailImage", // bring thumbnailImage forward
      },
    },
    {
      $sort: {
        score: -1,
        _id: 1,
      },
    },
    { $limit: 8 },
  ]);

  if (!products || products.length === 0) {
    throw new ApiError("No products found", 400);
  }

  sendResponse(res, 200, products, "Products found");
});

