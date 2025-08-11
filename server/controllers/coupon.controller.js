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


export const applyCoupon = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { couponCode } = req.validatedData.params;

  const GST_RATE = 0.12;
  const round2 = (n) => Math.round(n * 100) / 100;
  const addGST = (amt) => (amt == null ? null : round2(amt * (1 + GST_RATE)));

  // 1) Validate coupon
  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon) throw new ApiError("Coupon not found", 400);
  if (!coupon.isActive || new Date() > new Date(coupon.endDate)) {
    throw new ApiError("Coupon is expired", 400);
  }

  // 2) Load cart
  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart || !cart.products?.length) throw new ApiError("Cart is empty", 400);

  // 3) Build GST-inclusive cart total
  let totalPriceAfterDiscount = 0;

  for (const cartItem of cart.products) {
    const product = cartItem.productId;
    const variation = product?.variations?.find(
      (v) => v._id.toString() === cartItem.variationId.toString()
    );
    if (!variation) throw new ApiError("Cart has invalid variation", 400);

    const mrpWithGst = addGST(variation.price);              // MRP + GST
    const gstDiff = mrpWithGst - variation.price;            // GST amount on MRP

    const finalUnitPrice =
      variation.discountPrice != null
        ? round2(variation.discountPrice + gstDiff)          // discounted + GST diff
        : mrpWithGst;

    totalPriceAfterDiscount += round2(finalUnitPrice * (cartItem.quantity ?? 1));
  }

  // 4) Check coupon min amount against GST-inclusive total
  if (totalPriceAfterDiscount < coupon.minAmount) {
    throw new ApiError(
      `Order amount must be at least ₹${coupon.minAmount} to use this coupon`,
      400
    );
  }

  // 5) Apply coupon
  let couponValue = 0;
  if (coupon.discountType === "percentage") {
    couponValue = round2(totalPriceAfterDiscount * (coupon.discountValue / 100));
  } else {
    couponValue = round2(coupon.discountValue);
  }

  let amountAfterApplyingCoupon = totalPriceAfterDiscount+177 - couponValue;
  console.log("couponValue",couponValue)
  console.log("totalPriceAfterDiscount",totalPriceAfterDiscount)

  // 6) Respond (keeping your integer rounding style)
  sendResponse(
    res,
    200,
    {
      discountAfterApplyingCoupon: Math.floor(couponValue),
      amountAfterApplyingCoupon: Math.floor(amountAfterApplyingCoupon),
      cartTotalWithGST: Math.floor(totalPriceAfterDiscount),
    },
    "Coupon applied successfully"
  );
});

export const buyNowApplyCoupon = asyncHandler(async (req, res) => {
  const { couponCode, productId, variationId } = req.validatedData.params;
  const qty = Number(req.validatedData.query?.quantity ?? 1);

  const SHIPPING = 177;
  const GST_RATE = 0.12;
  const round2 = (n) => Math.round(n * 100) / 100;
  const addGST = (amt) => (amt == null ? null : round2(amt * (1 + GST_RATE)));

  // 1) Validate coupon
  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon) throw new ApiError("Coupon not found", 400);
  if (!coupon.isActive || new Date() > new Date(coupon.endDate)) {
    throw new ApiError("Coupon is expired", 400);
  }

  // 2) Load product & variation
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 400);

  const v = product.variations?.find((x) => x._id.toString() === variationId.toString());
  if (!v) throw new ApiError("Selected variation not found", 400);

  if (!v.inStock || v.quantity <= 0 || v.quantity < qty) {
    throw new ApiError("Product is out of stock", 400);
  }

  // 3) Price with GST and final unit price
  const mrpWithGst = addGST(v.price);           // MRP + 12% GST
  const gstDiff = mrpWithGst - v.price;         // GST amount on MRP
  const unitFinal =
    v.discountPrice != null ? round2(v.discountPrice + gstDiff) : mrpWithGst;

  const itemsSubtotal = round2(unitFinal * qty); // GST-inclusive items total (no shipping)

  // 4) Min amount check (against items subtotal)
  if (coupon.minAmount && itemsSubtotal < coupon.minAmount) {
    throw new ApiError(
      `Order amount must be at least ₹${coupon.minAmount} to use this coupon`,
      400
    );
  }

  // 5) Apply coupon on items subtotal
  let couponValue =
    coupon.discountType === "percentage"
      ? round2(itemsSubtotal * (coupon.discountValue / 100))
      : round2(coupon.discountValue);

  couponValue = Math.min(couponValue, itemsSubtotal); // safety

  // 6) Add shipping after coupon (shipping not discounted)
  const amountAfterApplyingCoupon = Math.floor(Math.max(0, itemsSubtotal + SHIPPING - couponValue));

  sendResponse(
    res,
    200,
    {
      discountAfterApplyingCoupon: Math.floor(couponValue),
      amountAfterApplyingCoupon,
      itemTotalWithGST: Math.floor(itemsSubtotal),
      shipping: SHIPPING,
      quantity: qty,
    },
    "Coupon applied successfully"
  );
});


