import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";


export const userGetCheckoutValues = createAsyncThunk('/user/checkout-values' , async()=>{
    try{
        const response = await userAxiosInstance.get('/get-checkout-values');
        return response?.data
    }
    catch(error){
        console.log(error)
    }
})


export const userBuyNowCheckOutValues = createAsyncThunk('/user/checkout-values' , async({productId })=>{
    try{
        const response = await userAxiosInstance.get(`/user/buy-now-checkout-values/${productId}`);
        return response
    }
    catch(error){
        console.log(error)
    }
})


const checkoutSlice = createSlice({
    name:"checkout",
    initialState :null,
    reducers:{},
    extraReducers:(builder)=>{}
})


export default checkoutSlice.reducer