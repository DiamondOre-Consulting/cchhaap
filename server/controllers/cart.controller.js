import { asyncHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import Cart from "../models/cart.model.js";
import sendResponse from "../utils/sendResponse.js";
import Wishlist from "../models/wishlist.model.js";






export const updateCart = asyncHandler(async(req,res)=>{

    const {quantity,productId,variationId} = req.validatedData.params
    const userId = req.user.id

        if(quantity<0){
            throw new ApiError("Quantity can not be in negative",400)
        }

       if(quantity==0){

        const cart = await Cart.findOne({userId})
     
        if(!cart){
            throw new ApiError("Cart for this user not found")
        }

       
        
        
        const existingProductInCartIndex = cart.products.findIndex(product=>product.productId._id.toString()==productId.toString())
       
        
        if(existingProductInCartIndex<0){
            throw new ApiError("Product not found in the cart",400)
        }
        else{
            cart.products.splice(existingProductInCartIndex,1)
        }
    
        await cart.save()
    
        return sendResponse(res,200,null,"Item removed from the cart")
        
       }



    const product = await Product.findById(productId)

    const selectedVariation = product.variations.find(
      (v) => v._id.toString() === variationId.toString()
    );

        if (!selectedVariation) {
        throw new ApiError("Selected variation not found", 400);
        }

        if(selectedVariation.quantity<quantity||selectedVariation.quantity==0||selectedVariation.quantity-quantity<0){
        throw new ApiError("Not enough stock for selected variation", 400);
        }   

        if (!selectedVariation.inStock){
        throw new ApiError("Not enough stock for selected variation", 400);
        }


    const cart= await Cart.findOne({userId})

    if(!cart){
        throw new ApiError("User not found",400)
    }
   
   const existingProductInCartIndex = cart.products.findIndex(
  product =>
    product.productId.toString() === productId.toString() &&
    product.variationId?.toString() === variationId.toString()
);
  

    if(existingProductInCartIndex<0){
        cart.products.push({ productId, variationId, quantity });
    }
    else{
        cart.products[existingProductInCartIndex].quantity = quantity;
    }


   await cart.save()

   sendResponse(res,200,cart,"Cart updated successfully")


})
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const GST_RATE = 0.12;
  const round2 = (n) => Math.round(n * 100) / 100;
  const addGST = (amt) => (amt == null ? null : round2(amt * (1 + GST_RATE)));

  const cart = await Cart.findOne({ userId }).populate({
    path: "products.productId",
    select: "productName variations thumbnailImage",
  });

  if (!cart) throw new ApiError("Cart not found", 400);

  cart.products = cart.products.map((item) => {
    const prod = item.productId;
    const varId = item.variationId?.toString?.() || String(item.variationId);
    const variation = prod?.variations?.find((v) => v._id.toString() === varId);

    // Variation missing
    if (!variation) {
      return {
        ...item.toObject?.() ?? item,
        inStock: false,
        unitPrice: 0,
        price: 0,
        availableQty: 0,
      };
    }

    // Stock flag
    const inStock = !!variation.inStock && (variation.quantity ?? 0) > 0;

    // Prices
    const mrpWithGst = addGST(variation.price);                     // MRP + GST
    const gstDiff = mrpWithGst - variation.price;                   // GST amount on MRP
    const discountedWithGst = variation.discountPrice != null
      ? round2(variation.discountPrice + gstDiff)                   // discounted + GST diff
      : null;

    const unitFinal = discountedWithGst ?? mrpWithGst;              // prefer discounted if present
    const qty = item.quantity ?? 1;

    // Update the matched variation pricing in the populated product for response
    const clonedVariations = prod.variations.map((v) => {
      if (v._id.toString() !== varId) return v;
      const base = v.toObject?.() ?? v;
      return {
        ...base,
        price: mrpWithGst,
        discountPrice: discountedWithGst,
      };
    });

    // Build updated item
    const updatedItem = {
      ...item.toObject?.() ?? item,
      inStock,
      availableQty: variation.quantity ?? 0,
      unitPrice: unitFinal,                           // per-unit final price shown to user
      price: round2(unitFinal * qty),                 // line total
      // keep variationId as ID
      productId: {
        ...(prod.toObject?.() ?? prod),
        variations: clonedVariations,
      },
    };

    return updatedItem;
  });

  cart.totalPrice = round2(cart.products.reduce((sum, p) => sum + (p.price || 0), 0));

  console.log(cart)

  sendResponse(res, 200, cart, "Cart fetched successfully");
});




 

export const removeItemFromCart = asyncHandler(async(req,res)=>{
    
    const {productId} = req.validatedData.params
    const userId = req.user.id

    const cart = await Cart.findOne({userId})
     
    if(!cart){
        throw new ApiError("User not found")
    }

  

    const existingProductInCartIndex = cart.products.findIndex(product=>product.productId.toString()==productId.toString())
    
    if(existingProductInCartIndex<0){
        throw new ApiError("Product not found in the cart",400)
    }
    else{
        cart.products.splice(existingProductInCartIndex,1)
    }

    await cart.save()

    sendResponse(res,200,null,"Item removed from the cart")
})



export const getNavbarCartAndWishlistCount = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    const wishlist = await Wishlist.findOne({ userId });

    const totalCartProductCount = cart?.products?.length || 0;
    const totalWishlistProductCount = wishlist?.products?.length || 0;

    sendResponse(res, 200, {
        totalCartProductCount,
        totalWishlistProductCount
    }, "Navbar cart and wishlist counts fetched successfully");
});









