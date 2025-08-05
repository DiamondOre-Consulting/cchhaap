import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Order from "../models/order.model.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";







export const getUser = asyncHandler(async (req, res) => {
    const {userId} = req.validatedData.params;

    const existingUser = await User.findById(userId)
        .select("_id fullName email phoneNumber createdAt updatedAt address wishList cart")
        .populate("address wishList cart");
     
        

    if (!existingUser) {
        throw new ApiError("User not found", 400);
    }
    const orderData = {}

    const orders = await Order.find({ userId: userId, order_status: "delivered" })

    orderData.totalOrders = orders.length||0;
    orderData.totalAmount = orders.reduce((acc, order) => acc + order.totalAmount, 0)||0;





    sendResponse(res, 200, {existingUser,orderData}, "User fetched successfully");
});

export const getSalesData = asyncHandler(async (req, res) => {
  const { orderStatus } = req.validatedData.query;
//   const { page, limit } = req.validatedData.params;
  

  const queryFilter = {};
  if (orderStatus) queryFilter.order_status = orderStatus;

//   const orders = await Order.find(queryFilter)
//     .populate("userId")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

  const ordersData = {};

  // Handle safely if aggregation returns empty array
  const [totalOrdersAgg] = await Order.aggregate([
    { $match: { order_status: "delivered" } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  const cancelledOrders = await Order.countDocuments({ order_status: "cancelled" });
  const totalUser = await User.countDocuments();

  const [todayOrdersAgg] = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    },
    {
      $group: {
        _id: null,
        todayTotalOrders: { $sum: 1 },
        todayTotalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  ordersData.todayTotalOrders = todayOrdersAgg?.todayTotalOrders || 0;
  ordersData.todayTotalAmount = todayOrdersAgg?.todayTotalAmount || 0;

  ordersData.totalOrders = totalOrdersAgg?.totalOrders || 0;
  ordersData.totalSales = totalOrdersAgg?.totalAmount || 0;

  ordersData.cancelledOrders = cancelledOrders;
  ordersData.totalUser = totalUser;

  sendResponse(res, 200, { ordersData }, "Sales data fetched successfully");
});


export const fetchAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.validatedData.params;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("_id fullName email phoneNumber createdAt updatedAt")
    .skip(skip)
    .limit(limit)
    .lean();

  if (!users.length) {
    throw new ApiError("No users found", 404);
  }

  // Get order data for all users (delivered only)
  const orders = await Order.find({}).lean();

  const orderMap = {};
  orders.forEach((order) => {
    const userId = order.userId.toString();
    if (!orderMap[userId]) {
      orderMap[userId] = { totalOrders: 0, totalAmount: 0 };
    }
    orderMap[userId].totalOrders += 1;
    orderMap[userId].totalAmount += order.totalAmount;
  });

  const formattedUsers = users.map((user) => ({
    ...user,
    orderData: {
      totalOrders: orderMap[user._id.toString()]?.totalOrders || 0,
      totalAmount: orderMap[user._id.toString()]?.totalAmount || 0,
    },
  }));

  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);

  sendResponse(
    res,
    200,
    { users: formattedUsers, totalPages, activePage: page },
    "Users fetched successfully"
  );
});

