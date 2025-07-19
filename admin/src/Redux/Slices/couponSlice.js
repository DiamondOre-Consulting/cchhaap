import { createAsyncThunk } from "@reduxjs/toolkit";
import adminAxiosInstance from "@/Helper/axiosInstance";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const getAllCoupons = createAsyncThunk(
  "/admin/get-all-coupons",
  async () => {
    try {
      const response = await adminAxiosInstance.get("/get-all-coupons");
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createCoupon = createAsyncThunk("/create/coupon", async (data) => {
  try {
    console.log(data);
    const response = await adminAxiosInstance.post("/create-coupon-code", data);
    console.log(response);
    toast.success(response?.data?.message);
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});

export const deleteCoupon = createAsyncThunk(
  "/delete-coupons",
  async (data) => {
    try {
      const response = await adminAxiosInstance.delete(
        `/delete-coupon-code/${data}`
      );
      console.log(response);
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
);

export const EditCoupon = createAsyncThunk("/edit/coupons", async (data) => {
  try {
    console.log(data);
    const response = await adminAxiosInstance.put(
      `/edit-coupon-code/${data?.couponId}`,
      data?.editCouponFormData
    );
    console.log(response);
    toast.success(response?.data?.message);
    return response?.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
    return;
  }
});

const couponSlice = createSlice({
  name: "coupon",
  initialState: null,
  reducers: {},
  extraReducers: () => {},
});

export default couponSlice.reducer;
