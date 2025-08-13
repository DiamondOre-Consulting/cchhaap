import { sendOtp, userSignUp } from "@/Redux/Slices/authSlice";
import { getNavbarCartWishlistCount } from "@/Redux/Slices/cart";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {Link, useNavigate} from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [otpField, setOtpField] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [loader, setLoader] = useState(false);
  const [slideStage, setSlideStage] = useState(0); // 0: email, 1: otp, 2: password
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
        setSlideStage(1); 
      }
    } catch (error) {
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
      toast.error("All the fields are required");
      return;
    }
    setLoader(true);

    try {
      const response = await dispatch(userSignUp(formData));
      if (response?.payload?.statusCode === 200) {
        navigate('/')
        dispatch(getNavbarCartWishlistCount())
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  const goToPasswordStage = () => {
    if (formData.otp.trim()) {
      setSlideStage(2); 
    } else {
      toast.error("Please enter OTP");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10" style={{ backgroundColor: '#6d0c04' }}>
      <div className="w-full max-w-md px-4 ">
        <div className="relative overflow-hidden">
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${slideStage >= step - 1 ? 'bg-white text-c2' : 'bg-gray-600 text-white'}`}
                  >
                    {step}
                  </div>
                  <span className="text-xs text-white mt-1">
                    {step === 1 ? 'Email' : step === 2 ? 'OTP' : 'Password'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-74">
        
            <div 
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${slideStage === 0 ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className=" bg-white/20 backdrop-blur border-gray-200 rounded-lg p-6 shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-c2 p-3 text-white rounded-full mb-3">
                    <FiMail className="text-gray-100 text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-100">Enter Your Email</h2>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center border-b border-gray-300 py-2">
                    <FiMail className="text-gray-100 mr-2" />
                    <input
                      type="email"
                      className="flex-1 outline-none"
                      placeholder="Your email address"
                      autoComplete="off"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <button
                    onClick={handleSendOtp}
                    className="w-full bg-c2 text-c1 py-2 cursor-pointer rounded-lg flex items-center justify-center"
                    disabled={loader}
                  >
                    {loader ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      <>
                        Continue <FiArrowRight className="ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

           
            <div 
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${slideStage === 1 ? 'translate-x-0' : slideStage < 1 ? 'translate-x-full' : '-translate-x-full'}`}
            >
              <div className="bg-white/20 backdrop-blur rounded-lg p-6 shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-c2 p-3 rounded-full mb-3">
                    <FaShieldAlt className="text-white  text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-100">Enter OTP</h2>
                  <p className="text-sm text-gray-200 mt-1">We sent a code to {formData.email}</p>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center border-b border-gray-300 py-2">
                    <FaShieldAlt className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      className="flex-1 outline-none"
                      placeholder="Enter 6-digit OTP"
                      autoComplete="off"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSlideStage(0)}
                      className="flex-1 border cursor-pointer  border-gray-300 text-gray-100 py-2 rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={goToPasswordStage}
                      className="flex-1 bg-c2 text-c1 cursor-pointer py-2 rounded-lg flex items-center justify-center"
                    >
                      Continue <FiArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            
            <div 
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${slideStage === 2 ? 'translate-x-0' : 'translate-x-full'}`}
            >
              <div className="bg-white/20 backdrop-blur rounded-lg p-6 shadow-lg">
                <div className="flex flex-col items-center mb-6">
                  <div className="bg-c2 p-3 rounded-full mb-3">
                    <FiLock className="text-white text-2xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-100">Create Password</h2>
                  <p className="text-sm text-gray-200 mt-1">Secure your account</p>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center border-b border-gray-300 py-2">
                    <FiLock className="text-gray-100 mr-2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="flex-1 outline-none"
                      placeholder="Create a password"
                      autoComplete="off"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="text-gray-100"
                    >
                      {showPassword ?    <FiEye />  :<FiEyeOff /> }
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSlideStage(1)}
                      className="flex-1 border border-gray-300 cursor-pointer text-gray-100 py-2 rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSignup}
                      className="flex-1 bg-c2 text-c1 py-2 cursor-pointer rounded-lg flex items-center justify-center"
                      disabled={loader}
                    >
                      {loader ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing Up...
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white ">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;