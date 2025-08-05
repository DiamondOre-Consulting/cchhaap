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
    const { address, paymentMethod } = req.validatedData.body;

    const user = await User.findById(userId).lean();
    if (!user) throw new ApiError("User not found", 404);

    const finalPaymentStatus = paymentMethod === "cod" ? "unpaid" : "paid";

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
      if (variation.quantity < quantity) throw new ApiError("Insufficient stock", 400);

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
        if (variation.quantity < item.quantity) throw new ApiError("Insufficient stock", 400);

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

    const newOrder = await Order.create([
      {
        userId,
        products: productsToOrder,
        totalAmount,
        couponDiscount,
        totalPriceAfterDiscount,
        totalMRPPrice,
        order_status: "pending",
        payment_status: finalPaymentStatus,
        payment_method: paymentMethod,
        shipping_address: address,
      },
    ], { session });
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

    for (const item of productsToOrder) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) continue;
      const variation = product.variations.id(item.variationId);
      if (!variation) continue;
      variation.soldCount = (variation.soldCount || 0) + item.quantity;
      variation.quantity = (variation.quantity || 0) - item.quantity;
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    const orderIdShort = newOrder[0]._id.toString().slice(0, 6);
    const productRows = productsToOrder.map((p) => `
      <tr>
        <td>${p.productId}</td>
        <td>${p.quantity}</td>
        <td>₹${p.price}</td>
      </tr>
    `).join("");

    const emailHTML = `
      <h2>Order #${orderIdShort} placed successfully!</h2>
      <p>Thank you for shopping with <strong>Chhaap</strong> – your favorite fashion wear brand.</p>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead>
          <tr><th>Product</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>${productRows}</tbody>
      </table>
      <p><strong>Total: ₹${totalAmount}</strong></p>
      <p>Payment Method: ${paymentMethod}</p>
    `;

    await sendMail(
      user.email,
      `Chhaap - Order #${orderIdShort} Confirmation`,
      emailHTML
    );

    await sendMail(
      "yashjadon@diamondore.in",
      `New Order #${orderIdShort} Received – Chhaap`,
      `<h3>New order received from ${user.fullName || address.fullName}</h3>${emailHTML}`
    );

    sendResponse(res, 200, newOrder[0], "Order created successfully");
  } catch (err){
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});


export const myOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page, limit } = req.validatedData.params;
  // const {orderType} = req.validatedData.query
  const skip = (page - 1) * limit;

  //  const query = { userId };
  // if (orderType) query.order_status = orderType;

  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "products.productId",
      select: "productName variations",
    });

   
 // console.log("orders",orders[0].products[0].productId.variations)
  if (!orders.length) {
    throw new ApiError("User has zero orders", 400);
  }

  const formattedOrders = orders.map((order) => {
    const formattedProducts = order.products.map((item) => {
      const product = item.productId;
      const variation = product?.variations?.find(
        (v) => v._id.toString() === item.variationId.toString()
      );
      return {
        productName: product?.productName || "",
        variationId: item.variationId,
        thumbnail: variation?.thumbnailImage?.secureUrl || "",
        size: variation?.size || "",
        color: variation?.color || {},
        quantity: item.quantity,
        price: item.price,
      };
    });

    return {
      _id: order._id,
      products: formattedProducts,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      status: order.order_status,
    };
  });

  const totalOrders = await Order.countDocuments({ userId });
  const totalPages = Math.ceil(totalOrders / limit);

  // console.log("formattedOrders",formattedOrders[0].products)

  sendResponse(
    res,
    200,
    { orders: formattedOrders, totalPages, activePage: page },
    "Orders fetched successfully"
  );
});




export const getSingleOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.validatedData.params;

  const order = await Order.findOne({ _id: orderId, userId })
    .populate("products.productId", "productName variations");

  if (!order) throw new ApiError("Order not found", 404);

  const formattedProducts = order.products.map((item) => {
    const product = item.productId;
    const variation = product?.variations?.find(
      (v) => v._id.toString() === item.variationId.toString()
    );
    return {
      productName: product?.productName || "",
      thumbnail: variation?.thumbnailImage?.secureUrl || "",
      quantity: item.quantity,
      price: item.price,
    };
  });

  sendResponse(res, 200, {
    _id: order._id,
    products: formattedProducts,
    totalAmount: order.totalAmount,
    orderStatus: order.order_status,
    createdAt: order.createdAt,
    shippingAddress: order.shipping_address,
    paymentMethod: order.payment_method,
  }, "Order fetched successfully");
});





