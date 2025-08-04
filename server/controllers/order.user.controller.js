import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Coupon from "../models/coupon.model.js";
import Product from "../models/product.model.js";
import sendResponse from "../utils/sendResponse.js";
import Order from "../models/order.model.js";
import { sendMail } from "../utils/mail.util.js";
import User from "../models/user.model.js";


export const createOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user.id;
    const { couponCode, productId, variationId, quantity } = req.validatedData.query;
    const { address, paymentStatus, paymentMethod } = req.validatedData.body;

    const user = await User.findById(userId).lean();
    if (!user) throw new ApiError("User not found", 404);

    let productsToOrder = [];
    let totalMRPPrice = 0;
    let totalPriceAfterDiscount = 0;

    if (productId && variationId && quantity) {
      const product = await Product.findById(productId).lean();
      if (!product) throw new ApiError("Product not found", 404);

      const variation = product.variations.find(
        (v) => v._id.toString() === variationId.toString()
      );
      if (!variation) throw new ApiError("Variation not found", 404);
      if (variation.stock < quantity) throw new ApiError("Insufficient stock", 400);

      const price = variation.discountPrice || variation.price;
      productsToOrder.push({
        productId,
        variationId,
        quantity,
        price: price * quantity,
      });
      totalPriceAfterDiscount = price * quantity;
      totalMRPPrice = variation.price * quantity;
    } else {
      const cart = await Cart.findOne({ userId }).populate("products.productId").session(session);
      if (!cart || !cart.products.length) throw new ApiError("Cart is empty", 400);

      for (const item of cart.products) {
        const product = item.productId;
        if (!product) continue;
        const variation = product.variations.find(
          (v) => v._id.toString() === item.variationId.toString()
        );
        if (!variation) continue;
        if (variation.stock < item.quantity) throw new ApiError("Insufficient stock", 400);

        const price = variation.discountPrice || variation.price;
        productsToOrder.push({
          productId: product._id,
          variationId: item.variationId,
          quantity: item.quantity,
          price: price * item.quantity,
        });
        totalPriceAfterDiscount += price * item.quantity;
        totalMRPPrice += variation.price * item.quantity;
      }
    }

    // Coupon logic
    let couponDiscount = 0;
    let totalAmount = totalPriceAfterDiscount;
    if (couponCode) {
      const coupon = await Coupon.findOne({ couponCode }).session(session);
      if (!coupon) throw new ApiError("Coupon not found", 400);
      if (!coupon.isActive || new Date() > new Date(coupon.endDate)) {
        throw new ApiError("Coupon is expired", 400);
      }
      if (totalPriceAfterDiscount < coupon.minAmount) {
        throw new ApiError(
          `Order amount must be at least ₹${coupon.minAmount} to use this coupon`,
          400
        );
      }
      couponDiscount = coupon.discountType === "percentage"
        ? totalPriceAfterDiscount * (coupon.discountValue / 100)
        : coupon.discountValue;
      totalAmount = Math.max(0, totalPriceAfterDiscount - couponDiscount);
    }

    const newOrder = await Order.create(
      [
        {
          userId,
          products: productsToOrder,
          totalAmount,
          couponDiscount,
          totalPriceAfterDiscount,
          totalMRPPrice,
          order_status: "pending",
          payment_status: paymentStatus,
          payment_method: paymentMethod,
          shipping_address: address,
        },
      ],
      { session }
    );
    if (!newOrder || !newOrder[0]) throw new ApiError("Error in creating order", 500);

    if (!productId) {
      await Cart.updateOne({ userId }, { $set: { products: [], totalPrice: 0 } }, { session });
    } else {
      await Cart.updateOne(
        { userId },
        { $pull: { products: { productId, variationId } } },
        { session }
      );
    }

    // Update stock and soldCount
    for (const item of productsToOrder) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) continue;
      const variation = product.variations.id(item.variationId);
      if (!variation) continue;
      variation.soldCount = (variation.soldCount || 0) + item.quantity;
      variation.stock = (variation.stock || 0) - item.quantity;
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    sendResponse(res, 200, newOrder[0], "Order created successfully");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});







