import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";

export const userUpdateCart = createAsyncThunk(
  "/user/update-cart",
  async ({ quantity, productId , variationId }) => {
    try {
      console.log(productId, quantity);
      const response = await userAxiosInstance.put(
        `/update-cart/${quantity}/${productId}/${variationId}`
      );
      toast?.success(response?.data?.message);
      return response.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
);

export const userGetCart = createAsyncThunk("/get-cart", async () => {
  try {
    const response = await userAxiosInstance.get("/get-cart");
    return response?.data;
  } catch (error) {
    console.log(error);
  }
});

export const userRomoveProductFromCart = createAsyncThunk(
  "/user-remove-product-from-cart",
  async (productId) => {
    try {
      const response = await userAxiosInstance.put(
        `/remove-item-from-cart/${productId}`
      );
      console.log(response);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);


export const getNavbarCartCount = createAsyncThunk('/user/navbarCart-Count', async()=>{
    try{
        const response = await userAxiosInstance.get('/user/navbar-cart-count');
        console.log(response)
        return response?.data
    }
    catch(error){
        console.log(error)
    }
})
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartCount : 0,
    cartItems:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getNavbarCartCount.fulfilled, (state , action)=>{
        state.cartCount = action?.payload?.data
    }).addCase(userUpdateCart.fulfilled, (state, action) => {
      state.cartItems = action?.payload?.data?.products|| [];
    })
  },
});

export default cartSlice.reducer;