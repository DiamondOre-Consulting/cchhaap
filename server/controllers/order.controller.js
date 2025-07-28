import Cart from "../models/cart.model.js";
import ApiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Coupon from "../models/coupon.model.js";


import Product from "../models/product.model.js";
import sendResponse from "../utils/sendResponse.js";
import Order from "../models/order.model.js";
import { sendMail } from "../utils/mail.util.js";








export const createOrder = asyncHandler(async(req,res)=>{
   
    const userId = req.user.id

    const {couponCode,productId} = req.validatedData.query

    const { address, paymentStatus, paymentMethod } = req.validatedData.body

    let totalPriceAfterDiscount;
    const cartQuery = productId
  ? [{ userId, "products.productId": productId }]
  : [{ userId }];
    
    const cart = await Cart.findOne(...cartQuery).populate("products.productId")
    

    if(!cart){
        throw new ApiError("User not exist",400)
    }

    if(productId){

        totalPriceAfterDiscount= cart.products[0].quantity*(cart.products[0].productId.discountedPrice? cart.products[0].productId.discountedPrice:cart.products[0].productId.price)


    }
    else{
                
                totalPriceAfterDiscount = cart.products.reduce((acc, product) => {
                    
                    if (product.productId.discountedPrice) {
                    
                        acc += product.productId.discountedPrice * product.quantity
                    }
                    else {
                    
                        acc += product.productId.price * product.quantity
                    }
                    return acc
                }, 0)



    }


    
        let amountAfterApplyingCoupon = 0
        let couponValue = 0
    
        if(couponCode){
            
            const coupon = await Coupon.findOne({couponCode})
            
            if(!coupon){
                   throw new ApiError("Coupon not found",400)
            }
           
            if(!coupon.isActive|| new Date() > new Date(coupon.endDate)){
                   throw new ApiError("Coupon is expired",400)
            }
    
            if (coupon) {
                    if (coupon.discountType === 'percentage') {
                        couponValue = totalPriceAfterDiscount * (coupon.discountValue / 100)
                        amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
                    }
                    else {
                        couponValue = coupon.discountValue
                        amountAfterApplyingCoupon = totalPriceAfterDiscount - couponValue
                    }
             }
        }

        let totalMRPPrice= null
        
        cart.products.forEach((prod)=>{
            prod.price = prod.productId.discountedPrice? prod.productId.discountedPrice*prod.quantity: prod.productId.price*prod.quantity;
            totalMRPPrice+= prod.productId.price*prod.quantity           
        })

        
       
        const rawCart = await Cart.findOne(...cartQuery)
         
    
        cart.products.forEach((prod,index)=>{
            prod.price = prod.productId.discountedPrice? prod.productId.discountedPrice*prod.quantity: prod.productId.price*prod.quantity;     
            rawCart.products[index].price = prod.price               
        })
  
        const newOrder = await  Order.create({
            userId,
            products:rawCart.products,
            totalAmount: amountAfterApplyingCoupon? amountAfterApplyingCoupon : totalPriceAfterDiscount,
            couponDiscount:amountAfterApplyingCoupon?totalPriceAfterDiscount-amountAfterApplyingCoupon:0,
            totalPriceAfterDiscount,
            totalMRPPrice,
            order_status: "pending",
            payment_status:paymentStatus,
            payment_method: paymentMethod,
            shipping_address:address
        })

        if(productId){
            await Cart.updateOne(
                {userId},
                { $pull: { products: { productId } } }
            )
        }

        else{
            await Cart.updateOne(
                { userId },
                { $set: { products: [], totalPrice: 0 } }
            );
        }


        if(!newOrder){
           throw new ApiError("Error in creating order",400)
        }

      
        const orderConfirmationTemplate = (customerName, orderId, products, totalAmount, paymentMethod) => {
            const productDetails = products.map(product => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <img src="${product.productId.thumbnailImage.secureUrl}" alt="${product.productId.productName}" width="80" style="border-radius: 5px;">
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <strong>${product.productId.productName}</strong><br>
                        ${product.productId.metalType !== 'none' ? `Metal: ${product.productId.metalType}` : ''}
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">₹${product.productId.discountedPrice || product.productId.price}</td>
                </tr>
            `).join('');
        
            return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order Confirmation - Punjab Jewellers</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <div style="padding: 20px; text-align: center;">
                        <h2 style="color: #d4af37;">Punjab Jewellers</h2>
                        <h3 style="color: #333;">Your Order Has Been Placed Successfully!</h3>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p>Dear ${customerName},</p>
                        <p>We are pleased to inform you that your order <strong>#${orderId}</strong> has been successfully placed.</p>
        
                        <h3>Order Summary:</h3>
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Image</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productDetails}
                            </tbody>
                        </table>
        
                        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        
                        <p>We will notify you once your order is shipped.</p>
        
                        <p>If you have any questions, feel free to contact us at <a href="mailto:support@punjabjewellers.com">support@punjabjewellers.com</a>.</p>
        
                        <p>Thank you for shopping with us!</p>
        
                        <p>Best Regards,<br><strong>Punjab Jewellers Team</strong></p>
                    </div>
                </div>
            </body>
            </html>
            `;
        };

        

        sendMail(req.user.email,`Order #${newOrder._id.toString().slice(0,6)} Placed Successfully – Punjab Jewellers`,orderConfirmationTemplate(address.fullName,newOrder._id.toString().slice(0,6),cart.products,amountAfterApplyingCoupon? amountAfterApplyingCoupon : totalPriceAfterDiscount,paymentMethod))



        const adminOrderNotificationTemplate = (customerName, customerEmail, orderId, products, totalAmount, paymentMethod) => {
            const productDetails = products.map(product => `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <img src="${product.productId.thumbnailImage.secureUrl}" alt="${product.productId.productName}" width="80" style="border-radius: 5px;">
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">
                        <strong>${product.productId.productName}</strong><br>
                        ${product.productId.metalType !== 'none' ? `Metal: ${product.productId.metalType}` : ''}
                    </td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${product.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">₹${product.productId.discountedPrice || product.productId.price}</td>
                </tr>
            `).join('');
        
            return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>New Order Placed - Punjab Jewellers</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <div style="padding: 20px; text-align: center;">
                        <h2 style="color: #d4af37;">Punjab Jewellers</h2>
                        <h3 style="color: #333;">New Order Received!</h3>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p><strong>Customer Name:</strong> ${customerName}</p>
                        <p><strong>Email:</strong> ${customerEmail}</p>
                        <p><strong>Order ID:</strong> #${orderId}</p>
        
                        <h3>Order Summary:</h3>
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Image</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${productDetails}
                            </tbody>
                        </table>
        
                        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                        
        
                        <p>Please process the order as soon as possible.</p>
        
                        <p>Best Regards,<br><strong>Punjab Jewellers System</strong></p>
                    </div>
                </div>
            </body>
            </html>
            `;
        };
        


        sendMail("yashjadon@diamondore.in",`New Order #${newOrder._id.toString().slice(0, 6)} Received – Punjab Jewellers`,
            adminOrderNotificationTemplate(
                address.fullName,
                req.user.email,
                newOrder._id.toString().slice(0, 6),
                cart.products,
                amountAfterApplyingCoupon || totalPriceAfterDiscount,
                paymentMethod,
            )
        );
        


        const bulkOps = cart.products.map((product)=>({
             updateOne:{
                filter : {_id : product.productId},
                update : { $inc: { soldCount: product.quantity, stock: -product.quantity }}
             }
        }))

        await Product.bulkWrite(bulkOps);

        sendResponse(res,200,newOrder,"Order created successfully")
   
})


