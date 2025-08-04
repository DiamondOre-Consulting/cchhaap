import { asyncHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import sendResponse from "../utils/sendResponse.js";
import ApiError from "../utils/apiError.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model.js";



export const getUserSingleProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { userId, color, size, variationId, attributes } = req.query || {};

  if (!productId) {
    throw new ApiError("Product ID is required", 400);
  }

  let parsedAttributes = {};
  try {
    parsedAttributes = attributes ? JSON.parse(attributes) : {};
  } catch (error) {
    console.warn("Failed to parse attributes", error);
  }

  const product = await Product.findById(productId)
    .select("-totalRatingSum -totalRatingsCount -isActive -createdAt -updatedAt -__v")
    .populate("category")
    .populate("variations.attributeDefinition");

  if (!product) {
    throw new ApiError("Product not found", 404);
  }

  const colorMap = {};
  const sizeMap = {};
  const attributeMap = {};
  const allColors = [];
  const allSizes = new Set();
  let selectedVariation = null;
  let hasSearchCriteria = !!color || !!size || !!variationId || Object.keys(parsedAttributes).length > 0;

  product.variations.forEach((variation) => {
    const colorObj = variation.color || {};
    const sizeValue = variation.size;
    const colorKey = colorObj.name || "Unknown";
    const colorId = colorObj._id ? colorObj._id.toString() : null;

    if (variation.attributes && variation.attributes instanceof Map) {
      variation.attributes.forEach((value, key) => {
        if (!attributeMap[key]) {
          attributeMap[key] = new Set();
        }
        attributeMap[key].add(value);
      });
    }

    if (!colorMap[colorKey]) {
      colorMap[colorKey] = {
        color: colorObj,
        thumbnailImage: variation.thumbnailImage,
        images: variation.images,
        sizes: [],
        variations: [],
        attributes: [],
      };
      if (colorId && !allColors.some(c => c._id?.toString() === colorId)) {
        allColors.push(colorObj);
      }
    }

    if (sizeValue) {
      colorMap[colorKey].sizes.push(sizeValue);
      allSizes.add(sizeValue);
      colorMap[colorKey].variations.push(variation);

      if (!sizeMap[sizeValue]) sizeMap[sizeValue] = [];
      sizeMap[sizeValue].push(variation);
    }

    const matchesSelection = () => {
      if (variationId && variation._id && variation._id.toString() === variationId.toString()) {
        return true;
      }

      const colorMatch = !color || (colorObj.name && colorObj.name.toLowerCase() === color.toLowerCase());
      const sizeMatch = !size || (sizeValue && sizeValue.toString() === size.toString());

      let attributesMatch = true;
      if (Object.keys(parsedAttributes).length > 0 && variation.attributes) {
        for (const [key, value] of Object.entries(parsedAttributes)) {
          if (variation.attributes.get(key) !== value) {
            attributesMatch = false;
            break;
          }
        }
      }

      return colorMatch && sizeMatch && attributesMatch;
    };

    if (matchesSelection()) {
      selectedVariation = variation;
    }
  });

  if (hasSearchCriteria && !selectedVariation) {
    throw new ApiError("Requested combination is not available", 404);
  }

  if (!selectedVariation && product.variations.length > 0) {
    selectedVariation = product.variations[0];
  }

  if (!selectedVariation) {
    throw new ApiError("No variations available for this product", 404);
  }

  const availableAttributes = {};
  Object.entries(attributeMap).forEach(([key, values]) => {
    availableAttributes[key] = Array.from(values);
  });

  let cartQuantity = 0;
  if (userId && selectedVariation?._id) {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      const item = cart.products.find(
        (p) => p.productId.toString() === product._id.toString() && p.variationId?.toString() === selectedVariation._id.toString()
      );
      cartQuantity = item?.quantity || 0;
    }
  }

  const response = {
    _id: product._id,
    productName: product.productName,
    brandName: product.brandName,
    category: product.category,
    subCategory: product.subCategory,
    description: product.description,
    sku: product.sku,
    colors: allColors,
    sizes: Array.from(allSizes),
    attributes: availableAttributes,
    variations: product.variations.map(v => ({
      _id: v._id,
      size: v.size,
      color: v.color,
      price: v.price,
      discountPrice: v.discountPrice,
      quantity: v.quantity,
      inStock: v.inStock,
      attributes: v.attributes ? Object.fromEntries(v.attributes) : null,
      thumbnailImage: v.thumbnailImage,
      images: v.images
    })),
    groupedByColor: colorMap,
    selectedVariation: {
      _id: selectedVariation._id,
      size: selectedVariation.size,
      color: selectedVariation.color,
      price: selectedVariation.price,
      discountPrice: selectedVariation.discountPrice,
      quantity: selectedVariation.quantity,
      inStock: selectedVariation.inStock,
      attributes: selectedVariation.attributes ? Object.fromEntries(selectedVariation.attributes) : null,
      thumbnailImage: selectedVariation.thumbnailImage,
      images: selectedVariation.images
    },
    colorSizeMap: Object.fromEntries(
      Object.entries(colorMap).map(([color, data]) => [color, Array.from(new Set(data.sizes))])
    ),
    sizeColorMap: Object.fromEntries(
      Object.entries(sizeMap).map(([size, variations]) => [
        size,
        Array.from(new Set(variations.map(v => v.color?.name).filter(Boolean)))
      ])
    ),
    cartQuantity
  };

  return sendResponse(res, 200, response, "Product fetched successfully");
});


export const getUserCategorizedProducts = asyncHandler(async (req, res) => {
  const { categoryId } = req.validatedData.params;
  const { userId } = req.validatedData.query;
  const limit = parseInt(req.params.limit) || 10;
  const page = parseInt(req.params.page) || 1;
  const skip = (page - 1) * limit;

  console.log(userId)

  // ✅ Get user's wishlist productIds
  const wishlist = await Wishlist.findOne({ userId });
  
  const wishlistProductIds = wishlist
    ? wishlist.products.map((p) => p.productId.toString())
    : [];

  // ✅ Get products by category (with pagination)
  const products = await Product.find({ category: categoryId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(); // lean for plain JS objects

  if (!products.length) throw new ApiError("No products found", 400);

  // ✅ Add isInWishlist flag manually
  const updatedProducts = products.map((product) => ({
    ...product,
    isInWishlist: wishlistProductIds.includes(product._id.toString()),
  }));

  

  sendResponse(res, 200, updatedProducts, "Products fetched successfully");
});

// export const getSingleCategoryProducts = asyncHandler(async (req, res) => {
//     const { categoryId } = req.validatedData.params;
//     const { userId } = req.validatedData.query;

//     const products = await Product.aggregate([
//         { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
//         {
//             $lookup: {
//                 from: "wishlists",
//                 let: { productId: "$_id" },
//                 pipeline: [
//                     { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//                     { $unwind: "$products" },
//                     { $match: { $expr: { $eq: ["$products.productId", "$$productId"] } } },
//                 ],
//                 as: "wishlist"
//             }
//         },
//         { $addFields: { isInWishlist: { $gt: [{ $size: "$wishlist" }, 0] } } },
//         { $project: { wishlist: 0 } },
//         { $sort: { createdAt: -1 } }
//     ]);

//     if (!products.length) throw new ApiError("No products found", 400);

//     sendResponse(res, 200, products, "Category products fetched successfully");
// });




export const getProductsByGender = asyncHandler(async (req, res) => {
  const { gender } = req.validatedData.params;
  const { userId, page = 1, limit = 10 } = req.validatedData.query;

  const skip = (page - 1) * limit;

  const matchStage = { "variations.gender": gender };
  const pipeline = [
    { $match: matchStage },
    ...(userId ? [
      {
        $lookup: {
          from: "wishlists",
          let: { productId: "$_id" },
          pipeline: [
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$products" },
            {
              $match: {
                $expr: { $eq: ["$products.productId", "$$productId"] },
              },
            },
          ],
          as: "wishlist",
        },
      },
      {
        $addFields: {
          isInWishlist: { $gt: [{ $size: "$wishlist" }, 0] },
        },
      },
      { $project: { wishlist: 0 } },
    ] : [
      { $addFields: { isInWishlist: false } }
    ]),
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ];

  const products = await Product.aggregate(pipeline);

  if (!products.length) throw new ApiError("No products found for this gender", 400);

  sendResponse(res, 200, products, "Gender products fetched successfully");
});




export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const { userId, page = 1, limit = 10 } = req.validatedData.query;
    
    const skip = (page - 1) * limit;

    const products = await Product.aggregate([
        { $match: { featuredProduct: true, isActive: true } },
        {
            $lookup: {
                from: "wishlists",
                let: { productId: "$_id" },
                pipeline: [
                    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                    { $unwind: "$products" },
                    { $match: { $expr: { $eq: ["$products.productId", "$$productId"] } } },
                ],
                as: "wishlist"
            }
        },
        { $addFields: { 
            isInWishlist: { $gt: [{ $size: "$wishlist" }, 0] }
        }},
        { $project: { wishlist: 0 } },
        { $sort: { createdAt: -1 } }, // Sorting by newest first
        { $skip: skip },
        { $limit: limit }
    ]);

    if (!products.length) throw new ApiError("No featured products found", 400);

    sendResponse(res, 200, products, "Featured products fetched successfully");
});


export const getUserAllProducts = asyncHandler(async (req, res) => {
  const { userId } = req.validatedData.query;
  const limit = parseInt(req.params.limit) || 10;
  const page = parseInt(req.params.page) || 1;
  const skip = (page - 1) * limit;

  const wishlist = await Wishlist.findOne({ userId });
  const wishlistProductIds = wishlist
    ? wishlist.products.map(p => p.productId.toString())
    : [];

  const products = await Product.find({ isActive: true })
    .select("productName brandName category featuredProduct variations")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  if (!products.length) throw new ApiError("No products found", 404);

  const updatedProducts = products.map(product => ({
    ...product,
    isInWishlist: wishlistProductIds.includes(product._id.toString())
  }));

  const totalCount = await Product.countDocuments({ isActive: true });

  sendResponse(res, 200, {
    products: updatedProducts,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit)
  }, "User products fetched successfully");
});




