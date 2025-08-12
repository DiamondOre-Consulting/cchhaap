import mongoose from "mongoose";




const ordersSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products : {
        type: [{
            productId :{ 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product' 
            },
            variationId:{
                type: mongoose.Schema.Types.ObjectId,
            },
            quantity :{ 
                type: Number ,
                 required: true 
                },
            price:{
                type: Number, 
                required:true
            },
            exchange_applied:{
                type:Boolean,
                default:false
            },
            order_status:{ 
                type: String, 
                enum: ["pending", "shipped", "delivered", "cancelled","exchanged"], 
                default: "pending" 
            },
        }]
    },
    totalAmount :{
        type: Number,
        required: true
    },
    couponDiscount:{
        type: Number,
        required: true,
        default:0
    },
    totalMRPPrice:{
       type:Number,
       required:true
    },
    totalPriceAfterDiscount:{
        type:Number,
        required:true
    },
    delivery_date: { type: Date, default: null },
    payment_status: { 
        type: String, 
        enum: ["paid", "unpaid", "refunded"], 
        default: "unpaid" 
    },
    payment_method: { 
        type: String, 
        enum: ["online", "cod"], 
        required: true 
    },
    shipping_address:{
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pinCode: { type: String, required: true },
        country: { type: String, required: true, default:"India" }
    },
},{
    timestamps: true
});

const Order = mongoose.model('Order',ordersSchema)

export default Order;