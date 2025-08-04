// import Cart from "../models/cart.model.js"
// import Coupon from "../models/coupon.model.js"
// import Product from "../models/product.model.js"
// import ApiError from "../utils/apiError.js"
// import { asyncHandler } from "../utils/asyncHandler.js"
// import sendResponse from "../utils/sendResponse.js"
// import crypto from "crypto"
// import { razorpay } from "../app.js"





// export const razorpayKey = asyncHandler(async(req,res)=>{
//     sendResponse(res,200,{key:process.env.RAZORPAY_KEY_ID},"Razorpay key found")
// })


// export const checkoutPayment = asyncHandler(async(req,res)=>{

//     const userId = req.user.id
//     const { couponCode , quantity , productId } = req.validatedData.query

//     let totalPriceAfterDiscount;
//     let totalAmount=0;

//     if(quantity&&productId){


//         const product = await Product.findOne({_id:productId})

//         if(!product){
//             throw new ApiError("Product not found",400)
//         }

//         if (product.discountedPrice) {
//             totalPriceAfterDiscount = product.discountedPrice * quantity;
//         } else {
//             totalPriceAfterDiscount = product.price * quantity;
//         }

//         totalAmount = totalPriceAfterDiscount;
//     }
//     else{

//         const cart = await Cart.findOne({ userId}).populate('products.productId')
       
//          if (!cart) {
//             throw new ApiError("User not found", 400);
//          }

//            totalPriceAfterDiscount = cart.products.reduce((acc, product) => {
           
//             if (product.productId.discountedPrice) {
               
//                 acc += product.productId.discountedPrice * product.quantity
//             }
//             else {
              
//                 acc += product.productId.price * product.quantity
//             }
//             return acc
//         }, 0)

//         totalAmount = totalPriceAfterDiscount;


//     }


//     let amountAfterApplyingCoupon = 0
//     let couponValue = 0

//     if(couponCode){
        
//         const coupon = await Coupon.findOne({couponCode})
        
//         if(!coupon){
//                throw new ApiError("Coupon not found",400)
//         }
       
//         if(!coupon.isActive|| new Date() > new Date(coupon.endDate)){
//                throw new ApiError("Coupon is expired",400)
//         }

//         if (coupon) {
//          if (coupon.discountType === 'percentage') {
//              couponValue = totalPriceAfterDiscount * (coupon.discountValue / 100)
//              amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
//          }
//          else {
//              couponValue = coupon.discountValue
//              amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
//          }
//          totalAmount = amountAfterApplyingCoupon
//          }

//     }

//     totalAmount = Math.floor(totalAmount)

//     if(totalAmount<1){
//         throw new ApiError("Cart is empty",400)
//     }

//     const razorAmount = totalAmount * 100
//     const option = {
//         amount: razorAmount,
//         currency: "INR",
//     }

//     const order = await razorpay.orders.create(option)
    
//     sendResponse(res,200,order,"Order created successfully")

// })


// export const verifyPayment = async (req, res) => {

//         const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.validatedData.body

//         const body = razorpay_order_id + "|" + razorpay_payment_id

//         const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body).digest('hex')

//         if (expectedSignature !== razorpay_signature) {
//            throw new ApiError("Invalid signature",400)
//         }
//         sendResponse(res,200,null,"Payment verified successfully")
// }