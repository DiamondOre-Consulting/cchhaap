import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import Wishlist from "../models/wishlist.model.js";
import sendResponse from "../utils/sendResponse.js";
import ApiError from "../utils/apiError.js";






export const addToWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.validatedData.params;
    const userId = req.user.id; 

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
        wishlist = new Wishlist({ userId, products: [] });
    }

    const alreadyExists = wishlist.products.some(p => p.productId.equals(productId));
    if (alreadyExists) {
        throw new ApiError("Product already in wishlist", 400);
    }

    wishlist.products.push({ productId });
    await wishlist.save();

    sendResponse(res, 200, wishlist, "Product added to wishlist");
});



export const removeFromWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.validatedData.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
        throw new ApiError("Wishlist not found", 404);
    }

    const initialLength = wishlist.products.length;
    wishlist.products = wishlist.products.filter(p => !p.productId.equals(productId));

    if (wishlist.products.length === initialLength) {
        throw new ApiError("Product not found in wishlist", 400);
    }

    await wishlist.save();
    sendResponse(res, 200, wishlist, "Product removed from wishlist");
});


export const getAllWishlistProducts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const page = Number(req.validatedData.page) || 1;
  const limit = Number(req.validatedData.limit) || 10;
  const skip = (page - 1) * limit;

  const GST_RATE = 0.12;
  const addGST = (n) => (n == null ? null : Math.round(n * (1 + GST_RATE) * 100) / 100);

  // One wishlist per user
  const wishlist = await Wishlist.findOne({ userId })
    .populate("products.productId", "productName brandName category featuredProduct variations thumbnailImage createdAt")
    .lean();

  if (!wishlist || !wishlist.products?.length) {
    throw new ApiError("No products in wishlist", 400);
  }

  const totalCount = wishlist.products.length;
  const slice = wishlist.products.slice(skip, skip + limit);

  const products = slice
    .map(({ productId: p }) => {
      if (!p) return null;

      const variations = (p.variations || []).map((v) => {
        const priceWithGst = addGST(v.price);              // MRP + GST
        const gstDiff = priceWithGst - v.price;            // GST amount
        return {
          ...v,
          price: priceWithGst,
          discountPrice:
            v.discountPrice != null
              ? Math.round((v.discountPrice + gstDiff) * 100) / 100
              : null,
        };
      });

      return {
        _id: p._id,
        productName: p.productName,
        brandName: p.brandName,
        category: p.category,
        featuredProduct: p.featuredProduct,
        thumbnailImage: p.thumbnailImage,
        createdAt: p.createdAt,
        variations,
        isInWishlist: true,
      };
    })
    .filter(Boolean);



  sendResponse(res, 200, {
    wishList:products,
    totalPages: Math.ceil(totalCount / limit),
    activePage: page,
    pageSize: limit,
    totalCount,
  }, "Wishlist products fetched successfully");
});
