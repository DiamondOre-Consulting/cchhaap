import { asyncHandler } from "../utils/asyncHandler.js";
import Coupon from "../models/coupon.model.js";
import sendResponse from "../utils/sendResponse.js";
import ApiError from "../utils/apiError.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";






export const createCoupon = asyncHandler(async(req,res)=>{

    const {couponCode,discountType,startDate,endDate,minAmount,discountValue,isActive} = req.validatedData.body 

    if (new Date(startDate) >= new Date(endDate)) {
        throw new ApiError("Invalid date range", 400);
    }

    const existingCoupon = await Coupon.findOne({couponCode})

    if(existingCoupon){
        throw new ApiError("Coupon already exists",400)
    }

    const newCouponCode = await Coupon.create({couponCode,discountType,startDate,endDate,minAmount,discountValue,isActive})

    sendResponse(res,200,newCouponCode,"Coupon created")
 
})

export const getAllCoupons = asyncHandler(async(req,res)=>{

    const coupons = await Coupon.find({})

    if(!coupons){
        throw new ApiError("No coupons found",400)
    }

    sendResponse(res,200,coupons,"Coupons found")

})

export const deleteCoupon = asyncHandler(async(req,res)=>{

    const {couponId} = req.validatedData.params

    const coupon = await Coupon.findById(couponId)

    if(!coupon){
        throw new ApiError("Coupon not found",404)
    }

    await Coupon.findByIdAndDelete(couponId)

    sendResponse(res,200,coupon,"Coupon deleted")

})

export const editCoupon = asyncHandler(async(req,res)=>{

    const {couponId} = req.validatedData.params
    const {startDate,endDate} = req.validatedData.body 


    if (new Date(startDate) >= new Date(endDate)) {
        throw new ApiError("Invalid date range", 400);
    }

    const existingCoupon= await Coupon.findById(couponId)
    if (!existingCoupon) {
        throw new ApiError("Coupon not found",400)    
    }

    

    Object.assign(existingCoupon, req.validatedData.body);
  
    
    await existingCoupon.save()

    sendResponse(res,200,existingCoupon,"Coupon updated")


})



export const applyCoupon = asyncHandler(async(req,res)=>{

    const userId = req.user.id
    const {couponCode}= req.validatedData.params

    const coupon = await Coupon.findOne({couponCode})

    if(!coupon){
        throw new ApiError("Coupon not found",400)
    }

    if(!coupon.isActive|| new Date() > new Date(coupon.endDate)){
        throw new ApiError("Coupon is expired",400)
    }




    const cart = await Cart.findOne({userId}).populate('products.productId')

          let totalPriceAfterDiscount = cart.products.reduce((acc, cartItem) => {
        const variation = cartItem.productId.variations.find(v => 
            v._id.toString() === cartItem.variationId.toString()
        );
        const price = variation.discountPrice || variation.price;
        return acc + (price * cartItem.quantity);
          }, 0);

        if(totalPriceAfterDiscount<coupon.minAmount){
            throw new ApiError("Price of product is smaller than required value to apply coupon",400)
        }



         let amountAfterApplyingCoupon = 0

         let couponValue = 0

        if(coupon.discountType === 'percentage'){
            couponValue = totalPriceAfterDiscount * (coupon.discountValue/100)
            amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
        }
        else{
            couponValue = coupon.discountValue
            amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
        }
        

       sendResponse(res,200,{discountAfterApplyingCoupon:Math.floor(couponValue),amountAfterApplyingCoupon:Math.floor(amountAfterApplyingCoupon)},"Coupon applied successfully")

})


export const buyNowApplyCoupon = asyncHandler(async(req,res)=>{

        const {couponCode,productId,variationId} = req.params

        const coupon = await Coupon.findOne({couponCode})
         
        if(!coupon){
            throw new ApiError("Coupon not found",400)
        }
     
        if(!coupon.isActive|| new Date() > new Date(coupon.endDate)){
            throw new ApiError("Coupon is expired",400)
        }
    
        const product = await Product.findOne({_id:productId})

        if(!product){
            throw new ApiError("Product not found",400)
        }


        
        
        let variation=product.variations.find(v=>v._id.toString()===variationId.toString())
        
        let totalPriceAfterDiscount = variation.discountPrice||variation.price
        
        
                if(variation.quantity<=0){
                    throw new ApiError("Product is out of stock",400)
                }


        if(totalPriceAfterDiscount<coupon.minAmount){
            throw new ApiError("Price of product is smaller than required value to apply coupon",400)
        }


       let amountAfterApplyingCoupon = 0

       let couponValue = 0

       if(coupon.discountType === 'percentage'){
           couponValue = totalPriceAfterDiscount * (coupon.discountValue/100)
           amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
       }
       else{
           couponValue = coupon.discountValue
           amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
       }
       
       
       sendResponse(res,200,{discountAfterApplyingCoupon:Math.floor(couponValue),amountAfterApplyingCoupon:Math.floor(amountAfterApplyingCoupon)},"Coupon applied successfully")

})

