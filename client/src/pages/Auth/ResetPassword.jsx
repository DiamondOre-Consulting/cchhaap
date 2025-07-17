import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { userResetPassword } from "../Redux/Slices/auth.slice";

const ResetPassword = () => {
  const { token, expiry } = useParams();
  console.log("expiry", expiry);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loader , setLoader] = useState(false)

  console.log(newPassword, token);

  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!expiry) return;

    const expiryTimestamp = Number(expiry);
    if (isNaN(expiryTimestamp)) {
      console.error("Invalid expiry timestamp:", expiry);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const expiryDate = new Date(expiryTimestamp);
      const timeDiff = expiryDate - now;


      if (timeDiff <= 0) {
        clearInterval(interval);
        setTimeLeft({ minutes: 0, seconds: 0 });
      } else {
        const minutes = Math.floor((timeDiff / 1000 / 60) % 60);
        const seconds = Math.floor((timeDiff / 1000) % 60);
        setTimeLeft({ minutes, seconds });
      }
    };

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(interval);
  }, [expiry]);

  const handleResetPassowrd = async (e) => {
    e.preventDefault();
    setLoader(true)
    try {
      console.log("mytoken and password", token, newPassword);
      if (!newPassword || !confirmPassword) {
        toast.error("Please enter password and confirm password");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const response = await dispatch(
        userResetPassword({ resetToken: token, newPassword })
      );
      console.log(response);
      if (response?.payload?.statusCode === 200) {
        navigate("/signin");
      }
    } catch (err) {
      console.log(err);
    }
    finally{
        setLoader(false)
    }
  };
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div>
      <div className="h-screen flex w-full items-center justify-center">
        <div className="h-screen flex justify-center md:-mt-42 items-center w-full">
          <form onSubmit={handleResetPassowrd}>
            <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-xl max-w-lg">
              <div className="space-y-4">
                <h1 className="text-center text-2xl font-semibold text-gray-700">
                  Reset Password
                </h1>

                <div className="flex border border-dotted items-center p-1  justify-center gap-4 text-black">
                  <h2 className=" text-lg font-semibold">Expiring in </h2>
                  <div className="flex items-center  justify-center gap-1">
                    <div className="flex  items-center">
                      <div className=" text-xl pr-1 font-semibold text-black rounded-md">
                        {formatTime(timeLeft.minutes)}
                      </div>
                      <span className="mt-1 text-sm text-gray-800">
                        Minutes
                      </span>
                    </div>
                    <div className=" text-xl font-semibold">:</div>
                    <div className="flex  items-center">
                      <div className="pr-1 text-xl font-semibold text-black rounded-md">
                        {formatTime(timeLeft.seconds)}
                      </div>
                      <span className="mt-1 text-sm text-gray-800">
                        Seconds
                      </span>
                    </div>
                  </div>
                </div>
                {timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
                  <div className=" ">
                    <div className="py-2 text-center text-[1rem] font-semibold">
                      Reset Password Link Expired. <br /> Please request a new
                      <span
                        onClick={() => navigate("/signin")}
                        className="text-blue-800 underline cursor-pointer"
                      >
                        {" "}
                        reset password link
                      </span>
                    </div>
                    <div></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center border-1 py-3 px-3 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                      </svg>
                      <input
                        className="pl-2 outline-none border-none w-full "
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter Your New Password"
                        required
                      />
                    </div>

                    <div className="flex items-center border-1 py-3 px-3 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                      </svg>
                      <input
                        className="pl-2 outline-none border-none w-full "
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Enter your password again"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="flex justify-start items-center mt-4">
                      <p className="inline-flex items-center text-gray-700 font-medium text-xs text-center">
                        <input
                          type="checkbox"
                          id="showPassword"
                          name="showPassword"
                          onChange={() => setShowPassword(true)}
                          className="mr-2"
                        />
                        <span className="text-xs font-semibold">
                          Show Password
                        </span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 mb-4 w-full shadow-md  text-white cursor-pointer bg-black py-2 rounded-md text-md tracking-wide transition duration-1000 "
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
                    "Reset Password"
                  )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;