import Cart from "../models/cart.model.js"
import Coupon from "../models/coupon.model.js"
import Product from "../models/product.model.js"
import ApiError from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import sendResponse from "../utils/sendResponse.js"
import crypto from "crypto"
import { razorpay } from "../app.js"





export const razorpayKey = asyncHandler(async(req,res)=>{
    sendResponse(res,200,{key:process.env.RAZORPAY_KEY_ID},"Razorpay key found")
})

export const checkoutPayment = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { couponCode, quantity, productId, variationId } = req.validatedData.query;

    let totalPriceAfterDiscount = 0;
    let totalAmount = 0;

    
    if (quantity && productId && variationId) {
        const product = await Product.findById(productId);
        if (!product) throw new ApiError("Product not found", 400);

        const selectedVariation = product.variations.find(
            (v) => v._id.toString() === variationId.toString()
        );

        if (!selectedVariation) throw new ApiError("Selected variation not found", 400);

        const price = selectedVariation.discountPrice ?? selectedVariation.price;
        totalPriceAfterDiscount = price * quantity;
        totalAmount = totalPriceAfterDiscount;
    } 
    
    
    else {
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        if (!cart || cart.products.length === 0) {
            throw new ApiError("Cart is empty", 400);
        }

        cart.products.forEach((product) => {
            const productDoc = product.productId;
            if (!productDoc) return;

            const matchedVariation = productDoc.variations.find(
                (v) => v._id.toString() === product.variationId?.toString()
            );

            if (!matchedVariation) return;

            const price = matchedVariation.discountPrice ?? matchedVariation.price;
            totalPriceAfterDiscount += price * product.quantity;
        });

        totalAmount = totalPriceAfterDiscount;
    }

    
    let couponValue = 0;
    if (couponCode) {
        const coupon = await Coupon.findOne({ couponCode });

        if (!coupon) throw new ApiError("Coupon not found", 400);
        if (!coupon.isActive || new Date() > new Date(coupon.endDate)) {
            throw new ApiError("Coupon is expired", 400);
        }

        if (coupon.discountType === "percentage") {
            couponValue = totalPriceAfterDiscount * (coupon.discountValue / 100);
        } else {
            couponValue = coupon.discountValue;
        }

        totalAmount = totalPriceAfterDiscount - couponValue;
    }

    totalAmount = Math.floor(totalAmount);

    if (totalAmount < 1) {
        throw new ApiError("Cart is empty or total is invalid", 400);
    }

    
    const razorAmount = totalAmount * 100; 
    const options = {
        amount: razorAmount,
        currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    sendResponse(res, 200, order, "Order created successfully");
});



export const verifyPayment = async (req, res) => {

        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.validatedData.body

        const body = razorpay_order_id + "|" + razorpay_payment_id

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET).update(body).digest('hex')

        if (expectedSignature !== razorpay_signature) {
           throw new ApiError("Invalid signature",400)
        }
        sendResponse(res,200,null,"Payment verified successfully")
}