import axiosInstance from "@/Helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";


export const getSingleProduct = createAsyncThunk('/user/single-product' , async(id)=>{
    try {
        const res = await axiosInstance.get(`/get-single-product/${id}`)
        console.log(res)
        return res.data
    } catch (error) {
        console.log(error)
    }
})

const productSlice = createSlice({
  name: "product",
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {},
});

export default productSlice.reducer;