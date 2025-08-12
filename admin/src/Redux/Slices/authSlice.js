import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import adminAxiosInstance from "@/Helper/axiosInstance";

export const adminSignin = createAsyncThunk("/admin/sign-in", async (data) => {
  try {
    const response = await adminAxiosInstance.post("/signin", data);

    return response?.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});

export const adminLogout = createAsyncThunk("/admin/log-out", async () => {
  try {
    const response = await adminAxiosInstance.get("/signout");
    return response?.data;
  } catch (error) {
    console.log(error);
  }
});

export const forgotPassword = createAsyncThunk(
  "/forgot-password",
  async (email) => {
    try {
      console.log(email);
      const response = await adminAxiosInstance.post(
        "/forgot-password",
        email
      );
      toast.success(response.data?.message);
      return response.data;
    } catch (err) {
      console.log(err);
      return toast.error(err?.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/reset-password",
  async ({ resetToken, newPassword }) => {
    try {
      const response = await adminAxiosInstance.post(
        `/reset-password/${resetToken}`,
        { newPassword }
      );
      toast.success(response?.data?.message);
      return response.data;
    } catch (err) {
      return toast.error(err?.response?.data?.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "/user/change-password",
  async ({ newPassword, oldPassword }) => {
    try {
      console.log("passsword new ", newPassword, "old", oldPassword);
      const response = await adminAxiosInstance.post(
        `/change-password/${newPassword}/${oldPassword}`
      );
      console.log(response);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
);

export const adminData = createAsyncThunk(
  "/admin/get-profile",
  async () => {
    try {
      const response = await adminAxiosInstance.get("/get-admin");
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const addBannerImage = createAsyncThunk('/admin/banner-image' , async(data)=>{
  try {
    const response = await adminAxiosInstance.post('/add-banner-images' , data)
    console.log(response);
    toast.success(response?.data?.message)
    return response?.data
  } catch (error) {
    console.log(error)
  }
})


export const getAllBanners = createAsyncThunk('/admin/banner-image' , async()=>{
  try {
    const response = await adminAxiosInstance.get('/get-all-banners' )
    console.log(response);
    return response?.data
  } catch (error) {
    console.log(error)
  }
})


export const editBanner = createAsyncThunk('/admin/banner-image' , async(formData)=>{
  try {
    const response = await adminAxiosInstance.put('/edit-banner-images',formData )
    console.log(response);
    toast.success(response?.data?.message)
    return response?.data
  } catch (error) {
    console.log(error)
  }
})

export const fetchAllUsers = createAsyncThunk('/admin/fetch-all-users', async({page , limit})=>{
  try {
    const response = await adminAxiosInstance.get(`/fetch-all-users/${page}/${limit}`);
    console.log(response);
    return response?.data
  } catch (error) {
    console.log(error)
  }
})

export const getSalesData = createAsyncThunk('/admin/sales-data' , async()=>{
  try {
    const response = await adminAxiosInstance.get('/get-sales-data');
    console.log(response);
    return response?.data;
  } catch (error) {
    console.log(error)
  }
})



export const getLineChartData = createAsyncThunk('/admin/line-chart-data' , async({year})=>{
  try {
     const queryParams = new URLSearchParams();
     if (year) queryParams.append("year", year);
    const response = await adminAxiosInstance.get(`/get-line-chart-sales-data?${queryParams?.toString()}`);
    console.log(response);
    return response?.data;
  } catch (error) {
    console.log(error)
  }
})

const authSlice = createSlice({
  name: "admin",
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {

  },
});

export default authSlice.reducer;