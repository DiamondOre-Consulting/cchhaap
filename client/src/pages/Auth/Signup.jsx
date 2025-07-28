import { sendOtp, userSignUp } from "@/Redux/Slices/authSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {Link, useNavigate} from 'react-router-dom'

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpField, setOtpField] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!formData?.email.trim()) {
      toast.error("Please enter a valid email ID");
      return;
    }

    setLoader(true);

    try {
      const response = await dispatch(sendOtp({ email: formData?.email }));
      if (response?.payload?.statusCode === 200) {
        setPasswordField(true);
        setOtpField(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !formData?.email.trim() ||
      !formData?.otp.trim() ||
      !formData?.password.trim()
    ) {
      toast.error("All the feilds are required");
      return;
    }
    setLoader(true);

    try {

      console.log(formData)
      const response = await dispatch(userSignUp(formData));
      if (response?.payload?.statusCode === 200) {
            navigate('/login')
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="max-h-screen flex flex-col pb-20 mt-20 items-center">
      <h1 className="myfont text-center text-3xl">Account Signup</h1>

      <form className="py-6 w-md space-y-4">
        <div className="flex flex-col space-y-1">
          <label className="text-xs text-gray-50 uppercase">Email</label>
          <input
            type="email"
            className="border px-1 py-1"
            autoComplete="off"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>

        {otpField && passwordField && (
          <>
            <div className="flex flex-col w-full">
              <label className="pb-1 text-xs text-gray-100 ">OTP</label>
              <div className="flex justify-start gap-2">
                <input
                  type="text"
                  className="border px-1 py-1 w-full"
                  autoComplete="off"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs uppercase text-gray-100">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="border px-1 py-1"
                autoComplete="off"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <p className="space-x-2 text-sm flex items-center mt-2">
                <input
                  type="checkbox"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
                <span>Show Password</span>
              </p>
            </div>
          </>
        )}

        <button
          onClick={otpField && passwordField ? handleSignup : handleSendOtp}
          className="cursor-pointer bg-c2 w-full py-2 text-c1"
          disabled={loader}
        >
          {loader ? (
            <div role="status" className="flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 text-gray-200 animate-spin fill-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="ml-2">Loading...</span>
            </div>
          ) : otpField && passwordField ? (
            "Sign Up"
          ) : (
            "Send Otp"
          )}
        </button>
        <p className="text-center">Already have an account <Link className="underline" to={'/login'}>signin</Link>?</p>
      </form>


    </div>
  );
};

export default Signup;