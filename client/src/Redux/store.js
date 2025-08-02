import { configureStore } from "@reduxjs/toolkit"
import authSlice from './Slices/authSlice'
import productSlice from './Slices/productsSlice'
import cartSlice from './Slices/cart'
import checkoutSlice from './Slices/checkoutSlice'
import couponSlice from './Slices/coupon.Slice'
import paymentSlice from './Slices/paymentSlice'
import orderSlice from './Slices/order.Slice'

export const store = configureStore({
    reducer:{
       user : authSlice,
       productSlice : productSlice,
       cart : cartSlice,
       checkout: checkoutSlice,
       coupon: couponSlice,
       payment:paymentSlice,
       order:orderSlice
    }
})