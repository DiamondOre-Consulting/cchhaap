import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { adminSignin, forgotPassword } from "@/Redux/Slices/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo2.jpg"

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordPopup, setForgotPasswordPopUp] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await dispatch(adminSignin(formData));
      console.log("my response", response);
      if (response?.payload?.success) {
        setLoader(false);
        navigate("/admin-dashboard");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        forgotPassword({ email: formData.email })
      );
      console.log(response);
    } catch (e) {
      console.log(err);
    }
  };

  return (
    <div>
      {!forgotPasswordPopup && (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-96 max-w-lg bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="p-8">
              <div className="mb-8 ">
                {/* <img src={logo} className="w-[20%] absolute top-0 left-0 mx-auto mb-4" alt="" /> */}
                <h1 className="text-3xl text-center  text-gray-900 leading-tight">
                  Admin Login
                </h1>
              </div>

              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="px-2 text-sm text-gray-500">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="bg-white rounded-lg max-w-md mx-auto py-2">
                  <div className="relative bg-inherit">
                    <input
                      type="email"
                      name="email"
                      onChange={handleInputChange}
                      value={formData.email}
                      className="peer bg-transparent h-12 w-full rounded-lg text-gray-900 placeholder-transparent ring-2 ring-gray-300 px-4 focus:ring-sky-500 focus:outline-none focus:border-sky-600 transition-all"
                      placeholder="Enter your email"
                      required
                    />
                    <label
                      for="email"
                      className="absolute cursor-text left-4 -top-3 text-sm text-gray-600 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                    >
                      Enter your email
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-lg max-w-md mx-auto py-2">
                  <div className="relative bg-inherit">
                    <input
                      onChange={handleInputChange}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      className="peer bg-transparent h-12 w-full rounded-lg text-gray-900 placeholder-transparent ring-2 ring-gray-300 px-4 focus:ring-sky-500 focus:outline-none focus:border-sky-600 transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <label
                      for="password"
                      className="absolute cursor-text left-4 -top-3 text-sm text-gray-600 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                    >
                      Password
                    </label>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showPassword"
                      name="showPassword"
                      onChange={() => setShowPassword(true)}
                      className="mr-2"
                    />
                    <label
                      for="rememberMe"
                      className="ml-2 text-sm text-gray-600"
                    >
                      Show Password
                    </label>
                  </div>
                  <a
                    onClick={() => setForgotPasswordPopUp(true)}
                    className="text-sm cursor-pointer text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full p-3 cursor-pointer  bg-c1 text-white rounded-lg hover:bg-gray-800 focus:outline-none transition-colors"
                >
                  {loader ? (
                    <div
                      role="status"
                      className="flex items-center justify-center"
                    >
                      <svg
                        aria-hidden="true"
                        className="inline w-6 h-6 text-gray-200 animate-spin  fill-gray-600 "
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
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {forgotPasswordPopup && (
        <main
          id="content"
          role="main"
          className=" z-40  inset-0 fixed flex justify-center  items-center    mx-auto p-6"
        >
          <div className="mt-7 bg-white w-full md:w-md rounded-xl shadow-lg">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <img src={logo} className="w-[20%] mx-auto mb-4" alt="" />

                <h1 className="block text-2xl font-bold text-gray-800 ">
                  Forgot password?
                </h1>
                <p className="mt-2 text-sm text-gray-600 ">
                  Remember your password?
                  <p
                    onClick={() => setForgotPasswordPopUp(false)}
                    className="text-blue-600 cursor-pointer decoration-2 hover:underline font-medium"
                  >
                    Login here
                  </p>
                </p>
              </div>

              <div className="mt-5">
                <form onSubmit={handleForgotPassword}>
                  <div className="grid gap-y-4">
                    <div>
                      <label
                        for="email"
                        className="block text-sm font-bold ml-1 mb-2 "
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          required
                        />
                      </div>
                      <p
                        className="hidden text-xs text-red-600 mt-2"
                        id="email-error"
                      >
                        Please include a valid email address so we can get back
                        to you
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="py-3 px-4 cursor-pointer inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-c1 text-white focus:ring-offset-2 transition-all text-sm "
                    >
                      Send Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Login;
