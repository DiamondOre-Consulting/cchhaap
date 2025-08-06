import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { resetPassword } from "../../Redux/Slices/authSlice";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const { token, expiry } = useParams();
  console.log("expiry", expiry);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

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

      console.log("Current Time:", now);
      console.log("Expiry Time:", expiryDate);

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
        resetPassword({ resetToken: token, newPassword })
      );
      console.log(response);
      if (response?.payload?.statusCode === 200) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  return (
    <div>
      <div className="h-screen flex w-full items-center justify-center">
        <div className="h-screen bg-gray-100 flex justify-center items-center w-full">
          <form onSubmit={handleResetPassowrd}>
            <div className="bg-white px-10 py-8 rounded-xl w-screen shadow-xl max-w-lg">
              <div className="space-y-4">
                <h1 className="text-center text-2xl font-semibold text-gray-700">
                  Reset Password
                </h1>
                <hr />

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
                     <span onClick={()=> navigate('/')} className="text-blue-800 underline cursor-pointer"> reset password link</span>
                    </div>
                    <div>
                  
                    </div>
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
                  <span className="text-xs font-semibold">Show Password</span>
                </p>
              </div>

              <button
                type="submit"
                className="mt-4 mb-4 w-full shadow-md  cursor-pointer bg-c1 text-white  py-2 rounded-md text-md tracking-wide transition duration-1000 "
              >
                Reset Password
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