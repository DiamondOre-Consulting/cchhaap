import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";

export const userGetRazorpayKey = createAsyncThunk('/user-razorpay-key' , async()=>{
    try{
            const response = await userAxiosInstance.get('/key');
            return response?.data;
    }
    catch(error){
    }
})

export const userCheckoutPayment = createAsyncThunk('/check-out/payment' , async(data)=>{
    try{
        
        const queryParams = new URLSearchParams();
        if (data?.couponName) queryParams.append("couponCode", data?.couponName);
        if (data?.totalItems) queryParams.append("quantity", data?.totalItems);
        if (data?.productId) queryParams.append("productId", data?.productId);
        if (data?.variationId) queryParams.append("variationId", data?.variationId);
  
       
  
            const response = await userAxiosInstance.post(`/checkout-payment?${queryParams.toString()}`)
            return response?.data
    }
    catch(error){
    }
})


export const userVarifyPayment  = createAsyncThunk('/verify-payment' , async(paymentDetails)=>{
    try{
            const response = await userAxiosInstance.post('/verify-payment' , paymentDetails);
            return response?.data
    }
    catch(error){
    }
})


const paymentSlice = createSlice({
    name:"payment",
    initialState :null,
    reducers : {},
    extraReducers : (builder)=>{}
})

export default paymentSlice.reducer