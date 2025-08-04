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



export const getSalesData = asyncHandler(async(req,res)=>{

    
  const {orderStatus} = req.validatedData.query;

  const {page,limit} = req.validatedData.params
  const skip = (page-1)*limit;


  const queryFilter = {}

  if (orderStatus) queryFilter.order_status = orderStatus;

  const orders = await Order.find(queryFilter).populate("userId").sort({createdAt:-1}).skip(skip).limit(limit);


  const ordersData = {}


  

  const [totalOrders] = await Order.aggregate([
        {$match: {order_status : "delivered"}},
        {$group: {_id:null, totalOrders: {$sum: 1}, totalAmount: {$sum: "$totalAmount"}}}
  ])

  const cancelledOrders = await Order.find({order_status:"cancelled"}).countDocuments();
  const totalUser =await  User.find().countDocuments();
 

  const [todayOrders] = await Order.aggregate([
    { $match: { createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } } },
    {
      $group: {
        _id: null,
        todayTotalOrders: { $sum: 1 },
        todayTotalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  ordersData.todayTotalOrders = todayOrders?.todayTotalOrders||0;
  ordersData.todayTotalAmount = todayOrders?.todayTotalAmount||0;

  ordersData.totalOrders = totalOrders.totalOrders||0;
  ordersData.totalSales = totalOrders.totalAmount||0;

  ordersData.cancelledOrders = cancelledOrders||0;
  ordersData.totalUser = totalUser||0;


  sendResponse(res,200,{orders,ordersData},"Sales data fetched successfully")


})


