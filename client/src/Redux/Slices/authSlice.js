import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import userAxiosInstance from "../../Helper/axiosInstance";

const initialState = {
  user: {},
  isLoggedIn: false,
};

export const sendOtp = createAsyncThunk("/send-otp", async (data) => {
  try {
    console.log(data);
    const response = await userAxiosInstance.post("/send-otp", {
      email: data.email,
    });
    console.log(response);
    toast.success(response?.data?.message);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const userSignUp = createAsyncThunk("/signup", async (data) => {
  try {
    console.log(data);
    const response = await userAxiosInstance.post("/signup", data);
    toast.success(response?.data?.message);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const userSignin = createAsyncThunk("/signin", async (data) => {
  try {
    console.log(data);
    const response = await userAxiosInstance.post("/signin", data);
    toast.success(response?.data?.message);
    return response?.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const userForgotPassword = createAsyncThunk(
  "/forgot-password",
  async (data) => {
    try {
      console.log();
      const response = await userAxiosInstance.post(
        "/forgot-password",
        data
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.message);
    }
  }
);

export const userResetPassword = createAsyncThunk(
  "/reset-password",
  async (data) => {
    try {
      console.log(data);
      const response = await userAxiosInstance.post(
        `/reset-password/${data?.resetToken}`,
        { newPassword: data?.newPassword }
      );
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      toast.error();
    }
  }
);

export const userSignOut = createAsyncThunk("/signout", async () => {
  try {
    const response = await userAxiosInstance.get("/signout");
    console.log(response);
    toast.success(response?.data?.message);
    return response?.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
});

export const getUserData = createAsyncThunk("/get-user-data", async () => {
  try {
    const response = await userAxiosInstance.get("/get-user-data");
    console.log(response);
    return response?.data;
  } catch (error) {
    initialState.isLoggedIn = false;
    console.log(error);
  }
});

export const editUserProfile = createAsyncThunk(
  "/edit-proifle",
  async (data) => {
    try {
      console.log(data);
      const response = await userAxiosInstance.post("/edit-profile" , data );
      console.log(response);
      toast.success(response?.data?.message);
      return response?.data;
    } catch (error) {
      console.log(error);
      // toast.error(error?.response?.data?.message);
    }
  }
);


export const userAddNewAddress = createAsyncThunk('/add-address' , async(data)=>{
  try{
    console.log(data)
      const response = await userAxiosInstance.post('/add-new-address' , data)
      toast.success(response?.data?.message)
      return response?.data
  }
  catch(error){
    console.log(error)
  }
})

export const userGetAllAddress  = createAsyncThunk('/all-address' , async()=>{
  try{
      const response = await userAxiosInstance.get('/all-address');
      return response?.data
  }
  catch(error){
    console.log(error)
  }
})


export const userEditAddress = createAsyncThunk('/edit-address' , async({editFormData , addressId})=>{
  try{
    console.log("inside slice",editFormData , addressId)
      const response = await userAxiosInstance.put(`/edit-address/${addressId}` , editFormData);
      toast.success(response?.data?.message)
      console.log(response)
  }
  catch(error){
    console.log(error)
  }
})

export const userDeleteAddress = createAsyncThunk('/delete-address' , async(addressId)=>{
  try{
        const response = await userAxiosInstance.delete(`/delete-address/${addressId}`);
        console.log(response);
        toast.success(response?.data?.message);
        return response?.data
  }
  catch(error){
    console.log(error)
  }
})


export const GetAllBannerImages = createAsyncThunk('/get-all-banner-images' ,async () => {
  try {
    const response = await userAxiosInstance.get("/get-all-banner-images");
    console.log("this is response ",response);
    return response?.data
  } catch (error) {
    console.log(error);
  }
});






const userAuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(userSignUp.fulfilled , (state ,action)=>{
      state.user = action?.payload;
      state.isLoggedIn= true
    })
      .addCase(userSignin.fulfilled, (state, action) => {
        state.user = action?.payload;
        state.isLoggedIn = true;
      })
      .addCase(userSignOut.fulfilled, (state) => {
        state.user = {};
        state.isLoggedIn = false;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.user = action?.payload;
        state.isLoggedIn = true;
      });
  },
});
export default userAuthSlice.reducer;