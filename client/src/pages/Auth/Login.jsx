import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { userForgotPassword, userSignin } from "../Redux/Slices/auth.slice";
// import { toast } from "sonner";
// import { getNavbarCartCount } from "../Redux/Slices/cart";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [forgotPasswordPopUp, setForgotPasswordPopUp] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {

      if (!formData?.password || formData.password.length < 6) {
        toast.error("Password must contain at least 6 characters");
      }
      const response = await dispatch(userSignin(formData));
      console.log(response);
      if (response?.payload?.statusCode === 200) {
        toast.success("user loggedin successfully")
        dispatch(getNavbarCartCount())
        navigate("/");
      }
   
    } catch (error) {
      console.log(error);
    }
    finally{
      setLoader(false)
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoader(true)
    try {
      if (!email === "") {
        toast.success("Enter your email Id");
      }
      const response = await dispatch(userForgotPassword({ email }));
      console.log(response);
    } catch (e) {
      console.log(err);
    }
    finally{
      setLoader(false);
      setEmail("")
      setForgotPasswordPopUp(false)
    }
  };

  return (
    <div>
      <div className="max-h-screen flex flex-col pb-20 mt-20 items-center ">
        <h1 className="myfont text-center text-3xl">Account Sigin</h1>

        <div>
          <div>
            <form onSubmit={handleSignIn}>
              <div className="py-4 w-md space-y-4 ">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-700">Email</label>
                  <input
                    type="text"
                    className="border px-1 py-1"
                    autocomplete="off"
                    name="email"
                    value={formData?.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-gray-700">password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border px-1 py-1 "
                    autocomplete="off"
                    name="password"
                    value={formData?.password}
                    onChange={handleInputChange}
                  />

                  <p className="space-x-2 text-sm  flex items-center mt-2">
                    <input
                      type="checkbox"
                      onClick={() => setShowPassword(true)}
                    />
                    <span>Show Password</span>
                  </p>
                </div>

                <button
                  type="submit"
                  className="bg-black cursor-pointer w-full py-2 text-white"
                >
                  {loader ? (
                    <div
                      role="status"
                      className="flex items-center justify-center"
                    >
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
                  ) : (
                    "Sign In"
                  )}
                </button>
                <p
                  onClick={() => setForgotPasswordPopUp(true)}
                  className="underline cursor-pointer -mt-2"
                >
                  Forgot Password?
                </p>
                <p className="text-center">
                  Dont have an account
                  <Link className="underline" to={"/signup"}>
                    signup
                  </Link>
                  ?
                </p>
              </div>
            </form>
          </div>
        </div>

        {forgotPasswordPopUp && (
          <main
            id="content"
            role="main"
            className="w-full z-40  absolute  max-w-xl mx-auto p-6"
          >
            <div className=" bg-white h-96 -mt-8  rounded-xl shadow-lg">
              <div className="p-4 sm:p-7">
                <div className="text-center">
                  <h1 className="block text-2xl myfont  text-gray-900 ">
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
                          className="block text-sm  ml-1 mb-2 "
                        >
                          Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                            required
                          />
                        </div>
                        <p
                          className="hidden text-xs text-red-600 mt-2"
                          id="email-error"
                        >
                          Please include a valid email address so we can get
                          back to you
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="py-3 px-4 cursor-pointer inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-black text-white  focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm "
                      >
                        {loader ? (
                          <div
                            role="status"
                            className="flex items-center justify-center"
                          >
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
                        ) : (
                          "Send Link"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default Login;