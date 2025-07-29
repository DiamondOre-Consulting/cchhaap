import { configureStore } from "@reduxjs/toolkit"
import authSlice from './Slices/authSlice'
import productSlice from './Slices/productsSlice'

export const store = configureStore({
    reducer:{
       user : authSlice,
       productSlice : productSlice
    }
})