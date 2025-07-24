import mongoose from 'mongoose'


const wishListSchema = new mongoose.Schema({

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productId : {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Product',
        }
    }]

},{
    timestamps:true
})

const Wishlist = mongoose.model('Wishlist',wishListSchema)

export default Wishlist