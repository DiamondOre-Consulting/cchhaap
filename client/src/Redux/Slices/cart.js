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


export const getNavbarCartWishlistCount = createAsyncThunk('/get-Navbar-Count' ,async () => {
  try {
    const response = await userAxiosInstance.get("/get-navbar-cart-wishlist-count");
    console.log("this is response ",response);
    return response?.data
  } catch (error) {
    console.log(error);
  }
});



const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartCount : 0,
     wishlistCount: 0,
    cartItems:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getNavbarCartWishlistCount.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.cartCount = action.payload.data.totalCartProductCount;
          state.wishlistCount = action.payload.data.totalWishlistProductCount;
        }
      })
      .addCase(userUpdateCart.fulfilled, (state, action) => {
        state.cartItems = action?.payload?.data?.products || [];
        state.cartCount = action.payload.data.products.length;     
      })
      .addCase(userRomoveProductFromCart.fulfilled, (state, action) => {
        state.cartCount = action.payload.data
      });
  
  },
});

export default cartSlice.reducer;