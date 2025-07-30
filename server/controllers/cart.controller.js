import { asyncHandler } from "../utils/asyncHandler.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apiError.js";
import Cart from "../models/cart.model.js";
import sendResponse from "../utils/sendResponse.js";






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

  const cart = await Cart.findOne({ userId }).populate({
    path: "products.productId",
    select: "productName variations thumbnailImage",
  });

  if (!cart) throw new ApiError("Cart not found", 400);

    cart.products.forEach((product) => {
    const variation = product.productId.variations.find(
      (v) => v._id.toString() === product.variationId.toString()
    );



    if (!variation) {
      product.price = 0;
      return;
    }

    const unitPrice = variation.discountPrice ?? variation.price;
    product.price = unitPrice * product.quantity;
    product.variationId = variation; 
  }); 

  cart.totalPrice = cart.products.reduce((sum, p) => sum + p.price, 0);

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






