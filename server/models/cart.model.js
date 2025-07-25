import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            variationId: {
                type: mongoose.Schema.Types.ObjectId,
            },
            quantity: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
              
            }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    }

})

const Cart = mongoose.model('Cart',cartSchema)

export default Cart