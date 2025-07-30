import { configureStore } from "@reduxjs/toolkit"
import authSlice from './Slices/authSlice'
import productSlice from './Slices/productsSlice'
import cartSlice from './Slices/cart'
import checkoutSlice from './Slices/checkoutSlice'

export const store = configureStore({
    reducer:{
       user : authSlice,
       productSlice : productSlice,
       cart : cartSlice,
       checkout: checkoutSlice
    }
})