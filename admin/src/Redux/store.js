import { configureStore } from "@reduxjs/toolkit"
import categorySlice from './Slices/categorySlice'
import couponSlice from './Slices/couponSlice'
import attributesSlice from './Slices/attributesSlice'
import adminSlice from './Slices/authSlice'

export const store = configureStore({
    reducer:{
        categorySlice : categorySlice,
        couponSlice : couponSlice,
        attributesSlice: attributesSlice,
        adminSlice : adminSlice
    }
})