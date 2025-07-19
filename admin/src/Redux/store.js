import { configureStore } from "@reduxjs/toolkit"
import categorySlice from './Slices/categorySlice'

export const store = configureStore({
    reducer:{
        categorySlice : categorySlice
    }
})