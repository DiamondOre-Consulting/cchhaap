import adminAxiosInstance from "@/Helper/axiosInstance";
import { toast } from "sonner";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const adminFetchAllOrders = createAsyncThunk(
  "/get-all-orders",
  async (data) => {
    try {
      console.log(data);
      const response = await adminAxiosInstance.get(
        `/get-all-orders-for-admin/${data?.page}/${data?.limit}`
      );
      console.log(response);
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

const OrderSlice = createSlice({
  name: "order",
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {},
});

export default OrderSlice.reducer;
