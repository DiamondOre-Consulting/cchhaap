import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";


export const userCreateOrder = createAsyncThunk('/user/order-slice' ,async(data)=>{
    try{
        console.log("order data is slice ",data)
        const queryParams = new URLSearchParams();
        if(data?.couponName) queryParams.append("couponCode" , data?.couponName);
        if (data?.productId) queryParams.append("productId", data?.productId);
  
        const response = await userAxiosInstance.post(`/user/create-order?${queryParams?.toString()}`, data);
        console.log(response);
        toast.success(response?.data?.message);
        return response?.data
    }
    catch(error){
        console.log(error)
    }
})


export const userGetAllOrders = createAsyncThunk('/user/all-orders' , async(data)=>{
    try{
       console.log("this is dkjfhakjsdfhj",data )
        const response = await userAxiosInstance.get(`/user/my-orders/${data?.page}/${data?.limit}`);
        console.log("slice response ",response);
        return response?.data;
    }
    catch(error){
        console.log(error)
    }
   
})


export const userGetSingleOrder = createAsyncThunk('/user/get-single-order' , async(orderId)=>{
    try{
                const response = await userAxiosInstance.get(`/user/fetch-single-order/${orderId}`);
                console.log(response);
                return response?.data
    }
    catch(error){
        console.log(error)
    }
})
const orderSlice = createSlice({
    name : "order",
    initialState :null,
    reducers:{},
    extraReducers:(builder)=>{}
})

export default orderSlice.reducer