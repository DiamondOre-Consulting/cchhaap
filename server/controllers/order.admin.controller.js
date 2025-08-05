import Order from "../models/order.model.js"
import ApiError from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import sendResponse from "../utils/sendResponse.js"









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
  await order.save();
  sendResponse(res, 200, {
    message: "Order status updated successfully",
  });
});



