import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";

export const userGetRazorpayKey = createAsyncThunk('/user-razorpay-key' , async()=>{
    try{
            const response = await userAxiosInstance.get('/key');
            return response?.data;
    }
    catch(error){
        console.log(error)
    }
})

export const userCheckoutPayment = createAsyncThunk('/check-out/payment' , async(data)=>{
    try{
        
        console.log("this is usercheckout ",data)
        const queryParams = new URLSearchParams();
        if (data?.couponName) queryParams.append("couponCode", data?.couponName);
        if (data?.totalItems) queryParams.append("quantity", data?.totalItems);
        if (data?.productId) queryParams.append("productId", data?.productId);
        if (data?.variationId) queryParams.append("variationId", data?.variationId);
  
       
  
        console.log("Query Params: " , queryParams.toString());
            const response = await userAxiosInstance.post(`/checkout-payment?${queryParams.toString()}`)
            console.log("checout payment response",response)
            return response?.data
    }
    catch(error){
        console.log(error)
    }
})


export const userVarifyPayment  = createAsyncThunk('/verify-payment' , async(paymentDetails)=>{
    try{
        console.log("paymentDetails" , paymentDetails)
        console.log(paymentDetails)
            const response = await userAxiosInstance.post('/verify-payment' , paymentDetails);
            console.log("response in slice ",response)
            return response?.data
    }
    catch(error){
        console.log(error)
    }
})


const paymentSlice = createSlice({
    name:"payment",
    initialState :null,
    reducers : {},
    extraReducers : (builder)=>{}
})

export default paymentSlice.reducer