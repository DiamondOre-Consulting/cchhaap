import { model, Schema } from "mongoose"

const couponSchema = new Schema({
    couponCode: {
        type: String,
        required: true,
        unique: true
    },
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
        default: "percentage"
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    minAmount: {
        type: Number,
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true
})

const Coupon = model("Coupon", couponSchema)

export default Coupon