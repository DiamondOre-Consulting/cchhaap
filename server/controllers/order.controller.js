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
    const { couponCode, productId } = req.validatedData.query;
    const { address, paymentStatus, paymentMethod } = req.validatedData.body;

    // Fetch user for email/fullName
    const user = await User.findById(userId).lean();
    if (!user) throw new ApiError("User not found", 404);

    // Build cart query
    const cartQuery = productId
      ? { userId, "products.productId": productId }
      : { userId };
    const cart = await Cart.findOne(cartQuery).populate("products.productId").session(session);
    if (!cart || !cart.products.length) throw new ApiError("Cart is empty", 400);

    // Filter products if productId is specified
    let productsToOrder = cart.products;
    if (productId) {
      productsToOrder = cart.products.filter(
        (p) => p.productId && p.productId._id.toString() === productId
      );
      if (!productsToOrder.length) throw new ApiError("Product not found in cart", 404);
    }

    // Validate product existence, variation, and stock
    for (const item of productsToOrder) {
      if (!item.productId) throw new ApiError("Product not found", 404);
      if (!item.variationId) throw new ApiError("Product variation not specified", 400);
      const variation = item.productId.variations.find(
        (v) => v._id && v._id.toString() === item.variationId.toString()
      );
      if (!variation) throw new ApiError("Product variation not found", 404);
      if (typeof item.quantity !== "number" || item.quantity < 1)
        throw new ApiError("Invalid product quantity", 400);
      if (
        typeof variation.stock === "number" &&
        variation.stock < item.quantity
      ) {
        throw new ApiError(
          `Insufficient stock for product: ${item.productId.productName} (variation)`,
          400
        );
      }
    }

    // Calculate prices
    let totalMRPPrice = 0;
    let totalPriceAfterDiscount = 0;
    const orderProducts = productsToOrder.map((item) => {
      const variation = item.productId.variations.find(
        (v) => v._id && v._id.toString() === item.variationId.toString()
      );
      const price = variation.discountPrice ? variation.discountPrice : variation.price;
      totalPriceAfterDiscount += price * item.quantity;
      totalMRPPrice += variation.price * item.quantity;
      return {
        productId: item.productId._id,
        variationId: item.variationId,
        quantity: item.quantity,
        price: price * item.quantity,
      };
    });

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
      if (coupon.discountType === "percentage") {
        couponDiscount = totalPriceAfterDiscount * (coupon.discountValue / 100);
      } else {
        couponDiscount = coupon.discountValue;
      }
      totalAmount = Math.max(0, totalPriceAfterDiscount - couponDiscount);
    }

    // Create order
    const newOrder = await Order.create(
      [
        {
          userId,
          products: orderProducts,
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

    // Update cart
    if (productId) {
      cart.products = cart.products.filter(
        (p) => p.productId && p.productId._id.toString() !== productId
      );
    } else {
      cart.products = [];
    }
    cart.totalPrice = 0;
    await cart.save({ session });

    // Update product variation stock and soldCount
    for (const item of productsToOrder) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) continue;
      const variation = product.variations.id(item.variationId);
      if (!variation) continue;
      variation.soldCount = (variation.soldCount || 0) + item.quantity;
      variation.stock = (variation.stock || 0) - item.quantity;
      await product.save({ session });
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Send emails (do not block response)
    const orderIdShort = newOrder[0]._id.toString().slice(0, 6);
    const orderConfirmationTemplate = (customerName, orderId, products, totalAmount, paymentMethod) => {
      const productDetails = products
        .map((product) => {
          // For email, fetch product and variation details
          const prod = cart.products.find(
            (p) => p.productId && p.productId._id.toString() === product.productId.toString() && p.variationId && p.variationId.toString() === product.variationId.toString()
          );
          const variation = prod && prod.productId.variations.find(
            (v) => v._id && v._id.toString() === product.variationId.toString()
          );
          return `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    ${variation && variation.thumbnailImage && variation.thumbnailImage.secureUrl ? `<img src=\"${variation.thumbnailImage.secureUrl}\" alt=\"${prod.productId.productName}\" width=\"80\" style=\"border-radius: 5px;\">` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    <strong>${prod.productId.productName || ''}</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">₹${product.price}</td>
            </tr>
          `;
        })
        .join("");
      return `
        <!DOCTYPE html>
        <html>
        <head><title>Order Confirmation</title></head>
        <body>
          <h2>Order #${orderId} placed successfully!</h2>
          <table>${productDetails}</table>
          <p>Total Amount: ₹${totalAmount}</p>
          <p>Payment Method: ${paymentMethod}</p>
        </body>
        </html>
      `;
    };
    const adminOrderNotificationTemplate = (customerName, customerEmail, orderId, products, totalAmount, paymentMethod) => {
      const productDetails = products
        .map((product) => {
          const prod = cart.products.find(
            (p) => p.productId && p.productId._id.toString() === product.productId.toString() && p.variationId && p.variationId.toString() === product.variationId.toString()
          );
          const variation = prod && prod.productId.variations.find(
            (v) => v._id && v._id.toString() === product.variationId.toString()
          );
          return `
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    ${variation && variation.thumbnailImage && variation.thumbnailImage.secureUrl ? `<img src=\"${variation.thumbnailImage.secureUrl}\" alt=\"${prod.productId.productName}\" width=\"80\" style=\"border-radius: 5px;\">` : ''}
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                    <strong>${prod.productId.productName || ''}</strong>
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">₹${product.price}</td>
            </tr>
          `;
        })
        .join("");
      return `
        <!DOCTYPE html>
        <html>
        <head><title>New Order Placed</title></head>
        <body>
          <h2>New Order #${orderId} received!</h2>
          <p>Customer: ${customerName} (${customerEmail})</p>
          <table>${productDetails}</table>
          <p>Total Amount: ₹${totalAmount}</p>
          <p>Payment Method: ${paymentMethod}</p>
        </body>
        </html>
      `;
    };
    // Send customer email
    sendMail(
      user.email,
      `Order #${orderIdShort} Placed Successfully – Punjab Jewellers`,
      orderConfirmationTemplate(user.fullName || address.fullName, orderIdShort, orderProducts, totalAmount, paymentMethod)
    );
    // Send admin email
    sendMail(
      "yashjadon@diamondore.in",
      `New Order #${orderIdShort} Received – Punjab Jewellers`,
      adminOrderNotificationTemplate(user.fullName || address.fullName, user.email, orderIdShort, orderProducts, totalAmount, paymentMethod)
    );

    // Respond
    sendResponse(res, 200, newOrder[0], "Order created successfully");
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});






