import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import ApiError from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { sendMail } from "../utils/mail.util.js"
import sendResponse from "../utils/sendResponse.js"
import mongoose from "mongoose"











export const fetchAllOrdersForAdmin = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedData.params;
  const skip = (page - 1) * limit;
  const {orderType} = req.validatedData.query
  const query ={}
     if (orderType) query.order_status = orderType;

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "userId",
      select: "-password -resetPasswordToken -resetPasswordTokenExpires",
    })
    .populate({
      path: "products.productId",
      select: "productName variations",
    });

  if (!orders.length) {
    throw new ApiError("No orders found", 400);
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
        size: variation?.size || "",
        color: variation?.color || {},
        exchanged:item.exchanged,
        exchangeApplied: item.exchange_applied || false,
        thumbnail: variation?.thumbnailImage?.secureUrl || "",
        quantity: item.quantity,
        price: item.price,
      };
    });

    return {
      _id: order._id,
      user: order.userId,
      products: formattedProducts,
      totalAmount: order.totalAmount,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      shippingAddress: order.shipping_address,
      createdAt: order.createdAt,
    };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });
  const totalPages = Math.ceil((await Order.countDocuments()) / limit);

  sendResponse(res, 200, {
    orders: formattedOrders,
    totalPages,
    activePage: page,
    message: todayOrders === 0 ? "No orders placed today" : "Orders fetched successfully",
  });
});

export const changeOrderStatus = asyncHandler(async (req, res) => {
  const { orderId, orderStatus } = req.validatedData.body;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError("Order not found", 400);
  }
  order.order_status = orderStatus;
  if(orderStatus=="delivered"){
    order.payment_status="paid"
    order.delivery_date=new Date();
  }
  await order.save();
  sendResponse(res, 200, {
    message: "Order status updated successfully",
  });
});



export const approveExchangeRequest = asyncHandler(async (req, res) => {
  const { orderId, variationId } = req.validatedData.params;
  
  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    const order = await Order.findById(orderId)
      .populate('products.productId')
      .populate('userId')
      .session(session);
    
    if (!order) throw new ApiError("Order not found", 400);

    const item = order.products.find(i => i.variationId.toString() === variationId.toString());
    if (!item) throw new ApiError("Item not found in order", 400);

    const product = await Product.findById(item.productId).session(session);
    if (!product) throw new ApiError("Product not found", 404);

    const variation = product.variations.id(variationId);
    if (!variation) throw new ApiError("Variation not found", 404);

    // Mark as exchanged
    item.exchanged = true;
    await order.save({ session });

    // Prepare email data
    const exchangeId = order._id.toString().slice(-6).toUpperCase();
    const exchangeDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    // User Email Template
    const userEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #388e3c;">Product Exchanged #${exchangeId}</h2>
        <p>Hello ${order.shipping_address.fullName || 'Customer'},</p>
        <p>Your exchange  has been processed successfully by our team.</p>
        
        <h3 style="margin-top: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Exchange Details</h3>
        <p><strong>Product:</strong> ${product.productName}</p>
        <p><strong>Size:</strong> ${variation.size}</p>
        <p><strong>Color:</strong> ${variation.color.name}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
          <p><strong>Approval Date:</strong> ${exchangeDate}</p>
          <p><strong>Reference ID:</strong> ${exchangeId}</p>
        </div>
        
        <p style="margin-top: 20px;">Thank you for shopping with us!</p>
      </div>
    `;

    // Admin Email Template
    const adminEmailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #388e3c;">Exchange Approved #${exchangeId}</h2>
        
        <div style="margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${order.shipping_address.fullName || 'Customer'}</p>
          <p><strong>Email:</strong> ${order.userId.email}</p>
          <p><strong>Order ID:</strong> ${order._id.toString().slice(-6).toUpperCase()}</p>
        </div>
        
        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Exchange Details</h3>
        <p><strong>Product:</strong> ${product.productName}</p>
         <p><strong>Size:</strong> ${variation.size}</p>
        <p><strong>Color:</strong> ${variation.color.name}</p>
        <p><strong>Quantity:</strong> ${item.quantity}</p>
        <p><strong>Price:</strong> ₹${(item.price/item.quantity).toFixed(2)} per item</p>
        
        <p style="margin-top: 20px;"><strong>Approved By:</strong> Admin</p>
        <p><strong>Approval Date:</strong> ${exchangeDate}</p>
      </div>
    `;

    // Send emails
    await sendMail(
      order.userId.email,
      `Your Exchange Request #${exchangeId} - Approved`,
      userEmailHTML
    );

    await sendMail(
      "anantasinghal28@gmail.com",
      `[Exchange Approved] #${exchangeId}`,
      adminEmailHTML
    );
  });
  
  session.endSession();
  sendResponse(res, 200, { message: "Exchange request approved successfully" });
});



