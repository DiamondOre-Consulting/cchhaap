import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";


export const userGetCheckoutValues = createAsyncThunk('/user/checkout-values' , async()=>{
    try{
        const response = await userAxiosInstance.get('/get-checkout-values');
        return response?.data
    }
    catch(error){
    }
})


export const userBuyNowCheckOutValues = createAsyncThunk('/user/checkout-values' , async({productId , variationId , quantity })=>{
    try{
        const response = await userAxiosInstance.get(`/buy-now-checkout-values/${productId}/${variationId}/${quantity}`);
        return response
    }
    catch(error){
    }
})


const checkoutSlice = createSlice({
    name:"checkout",
    initialState :null,
    reducers:{},
    extraReducers:(builder)=>{}
})


export default checkoutSlice.reducer