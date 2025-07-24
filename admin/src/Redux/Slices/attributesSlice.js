import adminAxiosInstance from "@/Helper/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const createAttributes = createAsyncThunk('/admin/attributs', async(data)=>{
    try {
        const res =await  adminAxiosInstance.post('/create-attribute-definition' , data)
        toast.success(res?.data?.message);
        return res;
    } catch (error) {
        console.log(error)
    }
})


export const getAllAttributes = createAsyncThunk('/admin-get-all-attributes' , async()=>{
    try {
        const response = await adminAxiosInstance.get('/get-all-attribute-definition')
        return response?.data
        
    } catch (error) {
        console.log(error)
    }
})

export const deleteAttribute =createAsyncThunk('/admin/delete-attribute',async(id)=>{
    try {
      
        const response = await adminAxiosInstance.delete(`/delete-attribute-definition/${id}`);
        toast.success(response?.data?.message);
        return response?.data
    } catch (error) {
        console.log(error)
    }
})


export const editAttribute = createAsyncThunk('/admin/edit-attribute' , async({id , data})=>{
    try {
        console.log(id , data)
        const response = await adminAxiosInstance.put(`/edit-attribute-definition/${id}` , data)
        console.log(response);
        toast.success(response?.data?.message)
        return response?.data
    } catch (error) {
        console.log(error)
    }
})

const attributesSlice = createSlice({
  name: "attributes",
  initialState: null,
  reducers: {},
  extraReducers: () => {},
});

export default attributesSlice.reducer;