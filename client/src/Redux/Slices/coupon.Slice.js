import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";


export const userApplyCoupon = createAsyncThunk('/apply-coupon' , async(couponName)=>{
    try{
            const response = await userAxiosInstance.get(`/apply-coupon/${couponName}`);
            toast.success(response?.data?.message);
            return response?.data
    }
    catch(error){
        toast.error(error?.response?.data?.message)
    }
})


export const userBuyNowCoupon = createAsyncThunk('/buy-now-apply-coupon' , async(data)=>{
    try{
            const response = await userAxiosInstance.get(`/buy-now-apply-coupon/${data?.couponName}/${data?.productId}/${data.variationId}`);
            toast.success(response?.data?.message);
            return response?.data
    }
    catch(error){
        toast.error(error?.response?.data?.message)
    }
})
const couponSlice = createSlice({
    name : "coupon",
    initialState :null,
    reducers:{},
    extraReducers:(builder)=>{}
})

export default couponSlice.reducer