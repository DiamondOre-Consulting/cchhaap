import adminAxiosInstance from "@/Helper/axiosInstance";
import { toast } from "sonner";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const adminFetchAllOrders = createAsyncThunk(
  "/get-all-orders",
  async (data) => {
    try {
      const queryParams = new URLSearchParams();
      if (data?.orderType) queryParams.append("orderType", data?.orderType);

      const response = await adminAxiosInstance.get(
        `/get-all-orders-for-admin/${data?.page}/${
          data?.limit
        }?${queryParams?.toString()}`
      );
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const adminGetSingleOrder = createAsyncThunk(
  "/user/get-single-order",
  async (orderId) => {
    try {
      const response = await userAxiosInstance.get(
        `/get-single-order/${orderId}`
      );
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const adminChangeStatus = createAsyncThunk('/admin/change-status' , async({orderId, orderStatus})=>{
  try {
    const response = await adminAxiosInstance.post('/change-order-status', {orderId , status:orderStatus});
    console.log(response);
    toast.success(response?.data?.message);
    return response?.data
  } catch (error) {
    console.log(error)
  }
})

const OrderSlice = createSlice({
  name: "order",
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {},
});

export default OrderSlice.reducer;
