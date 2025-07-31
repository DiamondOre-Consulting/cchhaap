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

    const page = parseInt(req.validatedData.page) || 1; 
    const limit = parseInt(req.validatedData.limit) || 10; 
    const skip = (page - 1) * limit; 

    const wishList = await Wishlist.find({ userId })  
        .sort({createdAt:-1})
        .populate("products.productId"," -soldCount -sku -totalRatingSum -totalRatingsCount") 
        .limit(limit)
        .skip(skip);

    if (!wishList || wishList.length === 0) {
        throw new ApiError("No products in wishlist", 400);
    }

    const totalPages = Math.ceil(await Wishlist.countDocuments({userId})/limit)

    sendResponse(res, 200, {wishList, totalPages, activePage:page}, "Wishlist products fetched successfully");
});