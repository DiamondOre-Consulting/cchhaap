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



export const buyNowCheckoutValues = async (req,res)=>{
         
        const { productId } = req.validatedData.params;
        const userId = req.user.id
 
  
        const existingProduct= await Product.findOne({_id:productId}).select("-soldCount -sku -discount -discountType -totalRatingSum -totalRatingsCount");

        if(!existingProduct){
           throw new ApiError("Product not found",400)
        }
        
       
      
        const cart = await Cart.findOne(
            { userId, "products.productId": productId },
        );
    
        if (!cart){
            throw new ApiError("Product not found in the cart",400)
        } 
        
        const quantityOfProductInCart = cart.products[0]?.quantity || 1;

        

        if(existingProduct.stock<quantityOfProductInCart||existingProduct.stock==0){
            
            throw new ApiError("Product out of stock",400)
        }

        const checkoutValues ={
            totalMRP:0,
            totalPriceAfterDiscount:0,
            totalDiscountedPrice:0,
            totalItems:1,
        };
    
        checkoutValues.totalMRP= existingProduct.price*quantityOfProductInCart
    
        if(existingProduct.discountedPrice){
            checkoutValues.totalPriceAfterDiscount=existingProduct.discountedPrice*quantityOfProductInCart
        }
        else{
            checkoutValues.totalPriceAfterDiscount=existingProduct.price*quantityOfProductInCart;
        }
  
        if(checkoutValues.totalPriceAfterDiscount==checkoutValues.totalMRP){
            checkoutValues.totalDiscountedPrice=0;
        }
        else{       
            checkoutValues.totalDiscountedPrice= checkoutValues.totalMRP-checkoutValues.totalPriceAfterDiscount
        }

        existingProduct.stock=undefined

         
        sendResponse(res,200,{checkoutValues,existingProduct,quantityOfProductInCart},"Buy now checkout values fetched successfully")
        
}