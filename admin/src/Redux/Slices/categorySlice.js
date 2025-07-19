import adminAxiosInstance from "@/Helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const createCategory = createAsyncThunk(
  "/admin/create-category",
  async (data) => {
    try {
      const res = await adminAxiosInstance.post("/create-category", data);
      toast.success(res.data.message);
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "/admin/get-category",
  async () => {
    try {
      const response = await adminAxiosInstance.get("/get-all-categories");
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "/admin/delete-category",
  async (id) => {
    try {
      const response = await adminAxiosInstance.delete(
        `/delete-category/${id}`
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);


export const editCategory = createAsyncThunk(
  "/admin/edit-category",
  async ({ id, formData }) => {
    try {
      const response = await adminAxiosInstance.put(
        `/edit-category/${id}` , formData
      );
      return response?.data;
    } catch (error) {
      console.log(error);
    }
  }
);


export const createSubCategory = createAsyncThunk(
  "/admin/create-category",
  async ({categoryId, subCategoryName}) => {
    try {
      const res = await adminAxiosInstance.post( `/create-sub-category/${categoryId}`,  { subCategoryName: subCategoryName });
      toast.success(res.data.message);
      return res?.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  "/delete/sub-category",
  async (data) => {
    try {
      console.log(data);
      const response = await adminAxiosInstance.delete(
        `/delete-sub-category/${data?.categoryId}`,
        { data: { subCategoryName: data?.subCategoryName } }
      );
      console.log(response);
      toast.success(response?.data?.message);
      return response;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const editSubCategory = createAsyncThunk(
  "/edit/sub-category",
  async (data) => {
    try {
      console.log(data);
      const response = await adminAxiosInstance.put(
        `/edit-sub-category/${data?.categoryId}`,
        {
          oldSubCategoryName: data?.subCategoryName,
          newSubCategoryName: data?.newSubCategoryName,
          indexOfOldCategory: data?.subcategoryIndex,
        }
      );
      console.log(response);
      toast.success(response?.data?.message);
      return response.data
      return response;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: null,
  reducers: {},
  extraReducers: () => {},
});

export default categorySlice.reducer;
