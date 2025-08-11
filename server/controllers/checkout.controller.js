import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendResponse from "../utils/sendResponse.js";


export const getCheckoutValues = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    

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
        shippingCost:177
    };

    checkoutValues.totalMRP = cart.products.reduce((acc, cartItem) => {
        
     
        const variation = cartItem.productId.variations.find(v => 
            v._id.toString() === cartItem.variationId.toString()
        );
        
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
    
    
    const gst=  Math.round( checkoutValues.totalMRP* 1.12 )- checkoutValues.totalMRP
    
    checkoutValues.totalPriceAfterDiscount = Math.round(
        checkoutValues.totalPriceAfterDiscount + checkoutValues.shippingCost 
    )+gst;

    
    checkoutValues.totalMRP = Math.round( checkoutValues.totalMRP* 1.12 );
    console.log(checkoutValues)

    sendResponse(res, 200, checkoutValues, "Checkout values fetched successfully");
});



export const buyNowCheckoutValues = asyncHandler(async (req, res) => {
  const { productId, variationId, quantity } = req.validatedData.params;
  const userId = req.user.id;

  const SHIPPING = 177;
  const GST_RATE = 0.12;
  const round0 = (n) => Math.round(n);
  const round2 = (n) => Math.round(n * 100) / 100;
  const addGST = (amt) => (amt == null ? null : round2(amt * (1 + GST_RATE)));

  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  const product = await Product.findById(productId).select(
    "-sku -totalRatingSum -totalRatingsCount -__v"
  );
  if (!product) throw new ApiError("Product not found", 400);

  const variationDoc = product.variations.id(variationId);
  if (!variationDoc) throw new ApiError("Selected variation not found", 400);

  if (!variationDoc.inStock || variationDoc.quantity <= 0 || variationDoc.quantity < qty) {
    throw new ApiError("Product variation out of stock", 400);
  }

  // Prices
  const mrpWithGst = addGST(variationDoc.price);          // MRP + 12% GST
  const gstDiff = mrpWithGst - variationDoc.price;        // GST amount on MRP
  const unitFinal =
    variationDoc.discountPrice != null
      ? round2(variationDoc.discountPrice + gstDiff)       // discounted + GST diff
      : mrpWithGst;

  // Totals
  const totalMRP = round0(mrpWithGst * qty);                              // GST-inclusive MRP total
  const itemsTotalAfterDiscount = round0(unitFinal * qty);                // before shipping
  const totalDiscountedPrice = round0(totalMRP - itemsTotalAfterDiscount);// savings vs MRP
  const totalPriceAfterDiscount = round0(itemsTotalAfterDiscount + SHIPPING);

  const checkoutValues = {
    totalMRP,
    totalPriceAfterDiscount,   // payable (items after discount + shipping)
    totalDiscountedPrice,      // savings vs MRP (shipping not counted here)
    totalItems: 1,
    shippingCost: SHIPPING,
  };

  // Return variation with computed prices for UI
  const variation = {
    ...(variationDoc.toObject?.() ?? variationDoc),
    price: mrpWithGst,
    discountPrice: variationDoc.discountPrice != null ? round2(variationDoc.discountPrice + gstDiff) : null,
  };

  sendResponse(
    res,
    200,
    { checkoutValues, variation, quantity: qty },
    "Buy now checkout values fetched successfully"
  );
});






