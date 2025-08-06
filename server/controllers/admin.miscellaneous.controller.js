import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Order from "../models/order.model.js";
import ApiError from "../utils/apiError.js";
import sendResponse from "../utils/sendResponse.js";
import Product from "../models/product.model.js";








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
  const ordersData = {};

  // Get total orders & total sales
  const [totalsAgg] = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSales: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Get delivered orders count
  const deliveredOrders = await Order.countDocuments({ order_status: "delivered" });

  // Get cancelled orders count
  const cancelledOrders = await Order.countDocuments({ order_status: "cancelled" });

  // Get today's orders and amount
  const [todayAgg] = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
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

  // Get total users
  const totalUsers = await User.countDocuments();

  // Build final response object with safe fallbacks
  ordersData.totalOrders = totalsAgg?.totalOrders || 0;
  ordersData.totalSales = totalsAgg?.totalSales || 0;
  ordersData.deliveredOrders = deliveredOrders;
  ordersData.cancelledOrders = cancelledOrders;
  ordersData.todayTotalOrders = todayAgg?.todayTotalOrders || 0;
  ordersData.todayTotalAmount = todayAgg?.todayTotalAmount || 0;
  ordersData.totalUsers = totalUsers;

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





export const searchProductForAdmin = asyncHandler(async (req, res) => {
  const { searchTerm } = req.validatedData.params;

  if (!searchTerm) {
    throw new ApiError("Search term is required", 400);
  }

  const products = await Product.aggregate([
    {
      $search: {
        index: "products_search_index",
        text: {
          query: searchTerm,
          path: "productName",
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    {
      $addFields: {
        score: { $meta: "textScore" },
      },
    },
    {
      $unwind: "$variations", // Flatten variations
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$$ROOT", "$variations"],
        },
      },
    },
    {
      $sort: {
        score: -1,
        _id: 1,
      },
    },
    { $limit: 8 },
  ]);

  if (!products || products.length === 0) {
    throw new ApiError("No products found", 400);
  }

  console.log(products)

  sendResponse(res, 200, products, "Products found");
});

export const getSalesDashboardData = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year); // e.g. ?year=2024
  if (!year || isNaN(year)) {
    throw new ApiError("Year query is required and must be a number", 400);
  }

  // Step 1: Get monthly sales for the selected year
  const salesData = await Product.aggregate([
    { $unwind: "$variations" },
    {
      $match: {
        updatedAt: {
          $gte: new Date(`${year}-01-01T00:00:00.000Z`),
          $lte: new Date(`${year}-12-31T23:59:59.999Z`)
        }
      }
    },
    {
      $group: {
        _id: { $month: "$updatedAt" },
        totalSales: { $sum: "$variations.soldCount" },
      },
    }
  ]);

  // Step 2: Initialize all 12 months with zero
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthlySales = monthNames.map((month, index) => {
    const monthIndex = index + 1;
    const found = salesData.find(item => item._id === monthIndex);
    return {
      month,
      sales: found ? found.totalSales : 0
    };
  });

  sendResponse(res, 200, {
    year,
    monthlySales,
  }, `Monthly sales data for ${year}`);
});
