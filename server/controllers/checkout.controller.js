import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";


export const getCheckoutValues = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("products.productId");
     console.log("cart",cart)

      if (!cart) {
        throw new ApiError("Cart for this user not found", 400);
    }

    if (!cart.products.length) {
        throw new ApiError("Product not found in the cart", 400);
    }

    const checkoutValues = {
        totalMRP: 0,
        totalPriceAfterDiscount: 0,
        totalDiscountedPrice: 0,
        totalItems: cart.products.length,
    };

    checkoutValues.totalMRP = cart.products.reduce((acc, cartItem) => {
        console.log("cartItem",cartItem)
        console.log(1)
        const variation = cartItem.productId.variations.find(v => 
            v._id.toString() === cartItem.variationId.toString()
        );
         console.log(variation)
        return acc + (variation.price * cartItem.quantity);
    }, 0);

    

    checkoutValues.totalPriceAfterDiscount = cart.products.reduce((acc, cartItem) => {
        const variation = cartItem.productId.variations.find(v => 
            v._id.toString() === cartItem.variationId.toString()
        );
        const price = variation.discountPrice || variation.price;
        return acc + (price * cartItem.quantity);
    }, 0);

    checkoutValues.totalDiscountedPrice = checkoutValues.totalMRP - checkoutValues.totalPriceAfterDiscount;

    sendResponse(res, 200, checkoutValues, "Checkout values fetched successfully");
});



export const buyNowCheckoutValues = asyncHandler(async (req, res) => {
  const { productId, variationId, quantity } = req.validatedData.params;
  const userId = req.user.id;


  const existingProduct = await Product.findById(productId).select(
    "-sku -discount -discountType -totalRatingSum -totalRatingsCount"
  );

  if (!existingProduct) {
    throw new ApiError("Product not found", 400);
  }

  const variation = existingProduct.variations.id(variationId);
  if (!variation) {
    throw new ApiError("Selected variation not found", 400);
  }

  if (variation.quantity < quantity || variation.quantity === 0) {
    throw new ApiError("Product variation out of stock", 400);
  }

  const checkoutValues = {
    totalMRP: variation.price * quantity,
    totalPriceAfterDiscount: variation.discountPrice
      ? variation.discountPrice * quantity
      : variation.price * quantity,
    totalDiscountedPrice: variation.discountPrice
      ? variation.price * quantity - variation.discountPrice * quantity
      : 0,
    totalItems: 1,
  };

  sendResponse(
    res,
    200,
    { checkoutValues, variation, quantity },
    "Buy now checkout values fetched successfully"
  );
});
