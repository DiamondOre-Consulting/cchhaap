import adminAxiosInstance from "@/Helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const createProduct = createAsyncThunk(
  "/admin/create-product",
  async (data) => {
    try {
      const response = await adminAxiosInstance.post("/add-new-product", data);
      console.log(response);
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message)
      throw error;
    }
  }
);

export const editProduct = createAsyncThunk(
  "/admin/edit-product",
  async ({ id, formData }) => {
    try {
      const response = await adminAxiosInstance.put(
        `/edit-product/${id}`,
        formData
      );
      toast.success(response?.data?.message);
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "/admin/delete-product",
  async (id) => {
    try {
      const res = await adminAxiosInstance.delete(`/delete-product/${id}`);
      toast.success(res?.data?.message);
    } catch (error) {
      console.log(error);
    }
  }
);
export const getAllProduct = createAsyncThunk(
  "/admin/get-all-product",
  async ({limit , page}) => {
    try {
      const response = await adminAxiosInstance.get(
        `/get-all-product/${limit}/${page}`
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const adminSearchProduct = createAsyncThunk("/admin/search", async (data) => {
  try {
    console.log(data)
    const response = await adminAxiosInstance.get(`/search-product/${data}`);
    console.log(response);
  
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});


const productSlice = createSlice({
  name: "product",
  initialState: null,
  reducers: {},
  extraReducers: () => {},
});

export default productSlice.reducer;
