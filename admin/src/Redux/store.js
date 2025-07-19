import { configureStore } from "@reduxjs/toolkit"
import categorySlice from './Slices/categorySlice'
import couponSlice from './Slices/couponSlice'

export const store = configureStore({
    reducer:{
        categorySlice : categorySlice,
        couponSlice : couponSlice
    }
})