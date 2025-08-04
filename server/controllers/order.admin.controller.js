import Order from "../models/order.model"
import ApiError from "../utils/apiError"
import { asyncHandler } from "../utils/asyncHandler"
import sendResponse from "../utils/sendResponse"











export const fetchAllOrdersForAdmin = asyncHandler(async(req,res)=>{

    const userId = req.user.id

    const {page,limit} = req.validatedData.params

    
    const skip = (page-1)*limit

    const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "userId",
      select: "-password -resetPasswordToken -resetPasswordTokenExpires"
    })
    .populate("products.productId")

    if(!orders.length){
      throw new ApiError("No orders found",400)
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = await Order.countDocuments({ createdAt: { $gte: today } });

    const totalPages = Math.ceil((await Order.countDocuments()) / limit);

    sendResponse(res, 200, {
        orders,
        totalPages,
        activePage: page,
        message: todayOrders === 0 ? "No orders placed today" : "Orders fetched successfully"
    });

})