import axiosInstance from "@/Helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { getNavbarCartWishlistCount } from "./cart";


export const getSingleProduct = createAsyncThunk('/user/single-product' , async({id , userId, color, size, variationId, selectedAttributes ={}})=>{
    try {
       const query = new URLSearchParams();
      if(userId) query.append("userId" , userId)
      if(color) query.append("color" , color)
      if(size) query.append("size" , size)
      if(variationId) query.append("variationId" , variationId)
      if (Object.keys(selectedAttributes).length > 0) {
        query.append("attributes", JSON.stringify(selectedAttributes));
      }

        const res = await axiosInstance.get(`/get-single-product/${id}?${query.toString()}`)
        return res.data
    } catch (error) {
    }
})


export const getAllProducts = createAsyncThunk('/user/all-product' , async({userId})=>{
    try {
       const query = new URLSearchParams();
      if(userId) query.append("userId" , userId)

        const res = await axiosInstance.get(`/get-all-product/${10}/${1}?${query.toString()}`)
        return res.data
    } catch (error) {
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
    }
  }
);


export const getCategorizedProduct = createAsyncThunk(
  "/admin/get-all-product",
  async ({id , userId}) => {
    try {
      const query = new URLSearchParams();
      if(userId) query.append("userId" , userId)
      const response = await axiosInstance.get(
        `/get-categorized-products/${id}?${query.toString()}`
      );
      return response?.data;
    } catch (error) {
    }
  }
);


export const getGenderWiseProduct = createAsyncThunk('/user/gender-wise-product', async({gender , userId})=>{
    try {
         const query = new URLSearchParams();
      if(userId) query.append("userId" , userId)
        const response = await axiosInstance.get(`/get-gender-based-products/${gender}?${query.toString()}`);
        return response?.data
    } catch (error) {
    }
})

export const addToWishlist = createAsyncThunk('/user/add-to-wishlist' , async(productId)=>{
    try {
        const response = await axiosInstance.post(`/add-to-wishlist/${productId}`);
        toast.success(response?.data?.message)
        return response?.data
    } catch (error) {
    }
})


export const removeFromWishlist = createAsyncThunk('/user/remove-to-wishlist' , async(productId)=>{
    try {
        const response = await axiosInstance.post(`/remove-from-wishlist/${productId}`);
        toast?.success(response?.data?.message)
        return response?.data
    } catch (error) {
    }
})


export const allWislist = createAsyncThunk('/user/get-wishlist' , async(productId)=>{
    try {
        const response = await axiosInstance.get(`/get-all-wishlist-products/${1}/${10}`);
        return response?.data
    } catch (error) {
    }
})

export const getFeaturedProducts = createAsyncThunk('/user/get-featured-products' , async()=>{
  try {
    const response =await axiosInstance.get('/get-featured-products');
    return response?.data
  } catch (error) {
  }
})


export const userProductSearch = createAsyncThunk("/user/search", async (data) => {
  try {
    const response = await axiosInstance.get(`/search-product/${data}`);
    // toast.success(response?.data?.message);
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


const productSlice = createSlice({
  name: "product",
  initialState:null
  ,
  reducers: {},
extraReducers: (builder) => {
  builder
    .addCase(addToWishlist.fulfilled, (state, action) => {
      // const dispatch = useDispatch();
      // dispatch(getNavbarCartWishlistCount())
    })
    .addCase(removeFromWishlist.fulfilled, (state, action) => {
      // const dispatch = useDispatch();
      // dispatch(getNavbarCartWishlistCount())
    })
   
   
}
});

export default productSlice.reducer;