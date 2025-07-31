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


export const getAllProducts = createAsyncThunk('/user/all-product' , async()=>{
    try {
        const res = await axiosInstance.get(`/get-all-product/${10}/${1}`)
        console.log(res)
        return res.data
    } catch (error) {
        console.log(error)
    }
})

export const categories = createAsyncThunk(
  "/user/get-all-categories",
  async () => {
    try {
      const response = await axiosInstance.get(
        `/get-all-categories`
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);


export const getCategorizedProduct = createAsyncThunk(
  "/admin/get-all-product",
  async (id) => {
    try {
      const response = await axiosInstance.get(
        `/get-categorized-products/${id}`
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);


export const getGenderWiseProduct = createAsyncThunk('/user/gender-wise-product', async(gender)=>{
    try {
        const response = await axiosInstance.get(`/get-gender-based-products/${gender}`);
        console.log(response);
        return response?.data
    } catch (error) {
        console.log(error)
    }
})

export const addToWishlist = createAsyncThunk('/user/add-to-wishlist' , async(productId)=>{
    try {
        const response = await axiosInstance.post(`/add-to-wishlist/${productId}`);
        toast.success(response?.data?.message)
        return response?.data
    } catch (error) {
        console.log(error)
    }
})


export const removeFromWishlist = createAsyncThunk('/user/remove-to-wishlist' , async(productId)=>{
    try {
        const response = await axiosInstance.post(`/remove-from-wishlist/${productId}`);
        toast?.success(response?.data?.message)
        return response?.data
    } catch (error) {
        console.log(error)
    }
})


export const allWislist = createAsyncThunk('/user/get-wishlist' , async(productId)=>{
    try {
        const response = await axiosInstance.get(`/get-all-wishlist-products/${1}/${10}`);
        return response?.data
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