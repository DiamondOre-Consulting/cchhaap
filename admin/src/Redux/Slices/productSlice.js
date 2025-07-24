import adminAxiosInstance from "@/Helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const createProduct = createAsyncThunk('/admin/create-product' , async(data)=>{
    try {
        const response = await adminAxiosInstance.post('/add-new-product' , data);
        console.log(response)
    } catch (error) {
        console.log(error)
    }
})

export const getAllProduct = createAsyncThunk('/admin/get-all-product' , async()=>{
    try {
        const response = await adminAxiosInstance.get(`/get-all-product/${10}/${1}`)
        return response?.data
    } catch (error) {
        console.log(error)
    }
})

const productSlice = createSlice({
  name: "product",
  initialState: null,
  reducers: {},
  extraReducers: () => {},
});

export default productSlice.reducer;