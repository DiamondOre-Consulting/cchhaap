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



export const adminChangeStatus = createAsyncThunk('/admin/change-status' , async({orderId, orderStatus})=>{
  try {
    const response = await adminAxiosInstance.post('/change-order-status', {orderId , orderStatus});
    console.log(response);
    toast.success(response?.data?.message);
    return response?.data
  } catch (error) {
    console.log(error)
  }
})


export const approveExchange = createAsyncThunk('/admin/approve-status' , async({orderId, variationId})=>{
  try {
    const response = await adminAxiosInstance.post(`/approve-exchange-request/${orderId}/${variationId}`);
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
