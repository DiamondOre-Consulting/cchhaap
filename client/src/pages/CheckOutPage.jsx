import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userBuyNowCheckOutValues, userGetCheckoutValues } from "../Redux/Slices/checkoutSlice";
import { IoClose } from "react-icons/io5";
import { userAddNewAddress, userDeleteAddress, userEditAddress, userGetAllAddress } from "@/Redux/Slices/authSlice";
import { IoIosAdd } from "react-icons/io";
import { toast } from "sonner";
import { FaPhoneAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { userApplyCoupon, userBuyNowCoupon } from "../Redux/Slices/coupon.Slice";
import { RxCross1 } from "react-icons/rx";
import confetti from "canvas-confetti";
import { userCheckoutPayment, userGetRazorpayKey, userVarifyPayment } from "../Redux/Slices/paymentSlice";
import { userCreateOrder } from "../Redux/Slices/order.Slice";
import { SiRazorpay } from "react-icons/si";
import { IoIosCash } from "react-icons/io";
import { getNavbarCartWishlistCount } from "../Redux/Slices/cart";

const CheckOutPage = () => {
  const dispatch = useDispatch();
  const [checkoutvalues, setCheckOutValues] = useState();
  const [addressId, setAddressId] = useState();
  const [loader, setLoader] = useState(false);
  const [editAddressPopUp, setEditAddressPopUp] = useState(false);
  const [addAddressPopUp, setAddAddressPopUp] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [successPopUp, setSuccessPopUp] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const productId = queryParams.get("product");
  const variationId = queryParams.get("variation");
  const quantity = Number(queryParams.get("quantity")) || 1;

  const [addAddressForm, setAddAddressForm] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    addressType: "",
    isDefault: false,
  });

  const [editFormData, setEditFormData] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    pinCode: "",
    addressType: "",
    isDefault: null,
  });

  const [couponName, setCouponName] = useState();
  const [tempCouponName, setTempCouponName] = useState();
  const [couponValue, setCouponValue] = useState();
  const [razorpayKey, setRazorpayKey] = useState();
  const [checkOutPaymentValues, setCheckOutPaymentValues] = useState();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 150,
      origin: { y: 0.8 },
    });
  };

  const handleGetCheckOutValue = async () => {
    try {
      const response = await dispatch(userGetCheckoutValues());
      setCheckOutValues(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBuyNowCheckOutValues = async () => {
    try {
      const response = await dispatch(
        userBuyNowCheckOutValues({ productId, variationId, quantity })
      );
      setCheckOutValues(response?.payload?.data?.data?.checkoutValues);
    } catch (error) {
      console.log(error);
    }
  };

  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    if (productId) {
      handleGetBuyNowCheckOutValues();
    } else {
      handleGetCheckOutValue();
    }
  }, [productId, cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const { fullName, phoneNumber, street, city, state, country = "India", pinCode } = addAddressForm;
      
      if (!fullName || !phoneNumber || !street || !city || !state || !country || !pinCode) {
        toast.error("Please fill all required fields.");
        setLoader(false);
        return;
      }

      if (pinCode.length !== 6) {
        toast.error("Please enter valid pincode");
        return;
      }

      if (phoneNumber.length !== 10) {
        toast.error("Please enter valid phone number");
        return;
      }

      const response = await dispatch(userAddNewAddress(addAddressForm));
      if (response?.payload?.statusCode === 200) {
        setAddAddressPopUp(false);
        await handleGetAllAddress();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const handleGetAllAddress = async () => {
    try {
      const response = await dispatch(userGetAllAddress());
      setAllAddress(response?.payload?.data);
      const defaultAddress = response?.payload?.data?.addresses.find(
        (adress) => adress?.isDefault === true
      );
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditClick = (address) => {
    setEditFormData(address);
    setAddressId(address?._id);
    setEditAddressPopUp(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    handleGetAllAddress();
  }, [dispatch]);

  const handleEditAddress = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      await dispatch(userEditAddress({ addressId, editFormData }));
      await handleGetAllAddress();
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      setEditAddressPopUp(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await dispatch(userDeleteAddress(addressId));
      await handleGetAllAddress();
    } catch (error) {
      console.log(error);
    }
  };

  const handleApplyCoupon = async () => {
    try {
      if (!tempCouponName) {
        toast.error("Please enter coupon Code");
        return;
      }
      setCouponName(tempCouponName);
      const res = await dispatch(userApplyCoupon(tempCouponName));
      if (res?.payload?.statusCode === 200) {
        setCouponValue(res?.payload?.data);
        handleConfetti();
      }
    } catch (error) {
      console.log(error);
      setCouponValue("");
    }
  };

  const handleBuyNowCouponApply = async () => {
    try {
      setCouponName(tempCouponName);
      if (!tempCouponName) {
        toast.error("Please enter coupon Code");
        return;
      }
      const res = await dispatch(
        userBuyNowCoupon({ couponName: tempCouponName, productId, variationId })
      );
      if (res?.payload?.statusCode === 200) {
        setCouponValue(res?.payload?.data);
        handleConfetti();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetRazorpayKey = async () => {
    try {
      const response = await dispatch(userGetRazorpayKey());
      setRazorpayKey(response?.payload?.data?.key);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetRazorpayKey();
  }, []);

  const paymentDetails = {
    razorpay_payment_id: "",
    razorpay_order_id: "",
    razorpay_signature: "",
    price: 0,
  };

  const handlecheckOutPayment = async (totalItems) => {
    try {
      if (!paymentMethod) {
        toast.error("Please Select Payment Method");
        return;
      }
      
      if (!selectedAddress) {
        toast.error("Please select the shipping address");
        return;
      }

      setLoader(true);
      const response = await dispatch(
        userCheckoutPayment({ couponName, totalItems, productId, variationId })
      );
      setCheckOutPaymentValues(response?.payload?.data);

      if (!razorpayKey) {
        console.log("Fetching Razorpay key again...");
        await handleGetRazorpayKey();
      }

      if (paymentMethod === "online") {
        if (!razorpayKey) {
          console.error("Razorpay key is missing");
          return toast.error("Payment system is not available. Try again later.");
        }

        const options = {
          key: razorpayKey,
          amount: response?.payload?.data?.amount,
          currency: response?.payload?.data?.currency,
          name: "CCHHAAP",
          description: "",
          image: "",
          order_id: response?.payload?.data?.id,
          handler: async function (res) {
            paymentDetails.razorpay_payment_id = res.razorpay_payment_id;
            paymentDetails.razorpay_order_id = res.razorpay_order_id;
            paymentDetails.razorpay_signature = res.razorpay_signature;
            
            const response = await dispatch(userVarifyPayment(paymentDetails));
            if (response?.payload?.success === true) {
              const res = await dispatch(
                userCreateOrder({
                  couponName,
                  productId,
                  quantity,
                  variationId,
                  address: {
                    fullName: selectedAddress?.fullName,
                    phoneNumber: selectedAddress?.phoneNumber,
                    street: selectedAddress?.street,
                    city: selectedAddress?.city,
                    state: selectedAddress?.state,
                    pinCode: selectedAddress?.pinCode,
                    country: selectedAddress?.country,
                  },
                  paymentMethod,
                  paymentStatus: "paid",
                })
              );

              navigate("/my-account?tab=tab-1", { replace: true });
              await dispatch(getNavbarCartWishlistCount());
            }
          },
          prefill: {
            name: "Zoya",
            email: "zoya@gmail.com",
            contact: "9811839410",
          },
          theme: {
            color: "#F37254",
          },
        };

        if (typeof window.Razorpay !== "undefined") {
          const razor = new window.Razorpay(options);
          razor.open();
        } else {
          console.error("Razorpay script not loaded");
          toast.error("Payment gateway is not available. Try again later.");
        }
      }
    } catch (error) {
      console.log("Payment error:", error);
      toast.error("Something went wrong with the payment.");
    } finally {
      setLoader(false);
    }
  };

  const handleCreateOrderId = async () => {
    try {
      if (!paymentMethod) {
        toast.error("Please select the payment method");
        return;
      }
      
      if (!selectedAddress) {
        toast.error("Please select the shipping address");
        return;
      }

      setLoader(true);
      const res = await dispatch(
        userCreateOrder({
          couponName,
          productId,
          address: {
            fullName: selectedAddress?.fullName,
            phoneNumber: selectedAddress?.phoneNumber,
            street: selectedAddress?.street,
            city: selectedAddress?.city,
            state: selectedAddress?.state,
            pinCode: selectedAddress?.pinCode,
            country: selectedAddress?.country,
          },
          paymentMethod: "cod",
          paymentStatus: "unpaid",
        })
      );

      if (res?.payload?.statusCode === 200) {
        toast.success(res?.payload?.message);
        setSuccessPopUp(true);
        await dispatch(getNavbarCartWishlistCount());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row px-4 md:px-10 justify-between md:space-y-0 space-y-4 md:space-x-8">
        <div className="shadow-xl md:min-w-4xl p-4 myfont">
          <div>
            <div className="flex justify-between">
              <p className="text-xl underline font-bold">Select Delivery Address</p>
              <button
                onClick={() => setAddAddressPopUp(true)}
                className="cursor-pointer flex items-center text-sm md:text-md bg-c2 text-c1 font-bold px-1 md:px-6 py-2"
              >
                <IoIosAdd className="text-c1 z-40" /> Address
              </button>
            </div>

            <div>
              {allAddress?.addresses?.map((address, index) => (
                <div key={index} className="mt-4 md:w-xl">
                  <div className="flex space-x-2">
                    <input
                      type="radio"
                      className="w-4"
                      checked={address?.isDefault}
                      onChange={() => setSelectedAddress(address)}
                    />
                    <p>{address?.fullName}</p>
                  </div>
                  <p>
                    {address?.street}, {address?.city}, {address?.state}, {address?.pinCode}, {address?.country}
                  </p>
                  <p className="flex items-center space-x-2">
                    <FaPhoneAlt />
                    <span>{address?.phoneNumber}</span>
                  </p>
                  <div className="flex space-x-4 text-c1 mt-2">
                    <button
                      className="bg-c2 px-6 py-2 cursor-pointer"
                      onClick={() => handleEditClick(address)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address?._id)}
                      className="cursor-pointer bg-white px-6 py-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shadow-xl bg-white rounded text-c1 myfont w-full py-3">
          <p className="font-bold text-center text-xl underline">Delivery Estimates</p>

          <div className="mt-4 text-lg space-y-2 px-4">
            <p>Total Items ({checkoutvalues?.totalItems})</p>
            <div className="flex justify-between">
              <p>Total MRP</p>
              <p>
                {checkoutvalues?.totalMRP.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>

            <div className="flex justify-between">
              <p>Discount</p>
              <p>
                -
                {checkoutvalues?.totalDiscountedPrice.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>
            </div>

            <div className="flex my-3 space-x-4 items-center justify-between">
              <div className="relative flex items-center justify-end">
                <input
                  onChange={(e) => setTempCouponName(e.target.value)}
                  value={tempCouponName}
                  className="border border-gray-400 px-2 rounded-md w-full"
                  type="text"
                  placeholder="Apply Coupon Code"
                />
                <RxCross1
                  className="absolute text-sm mr-2 cursor-pointer"
                  onClick={() => {
                    setTempCouponName("");
                    setCouponValue(null);
                  }}
                />
              </div>

              <button
                onClick={() => {
                  if (productId) {
                    handleBuyNowCouponApply();
                  } else {
                    handleApplyCoupon();
                  }
                }}
                className="bg-black cursor-pointer text-white py-2 px-4 text-sm rounded-md"
              >
                Apply
              </button>
            </div>

            {couponValue && (
              <div className="flex justify-between">
                <p>Coupon applied</p>
                <p className="text-green-600">
                  {couponValue.discountAfterApplyingCoupon?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </p>
              </div>
            )}

            <div className="flex border-t-2 py-2 justify-between">
              <p>Total Amount</p>
              <p>
                {couponValue
                  ? couponValue?.amountAfterApplyingCoupon?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })
                  : checkoutvalues?.totalPriceAfterDiscount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
              </p>
            </div>

            <div className="flex justify-between space-x-4 items-center">
              <button
                onClick={() => setPaymentMethod("online")}
                className={`border py-2 cursor-pointer text-white text-center flex justify-center items-center w-full ${
                  paymentMethod === "online" ? "border-4 border-blue-500" : "border-blue-900"
                } bg-blue-900`}
              >
                <SiRazorpay />
                Razerpay
              </button>
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`border py-2 cursor-pointer flex justify-center items-center w-full text-white bg-yellow-600 space-x-1 ${
                  paymentMethod === "cod" ? "border-4 border-yellow-500" : ""
                }`}
              >
                <IoIosCash />
                <span>COD</span>
              </button>
            </div>
            <button
              onClick={() => {
                if (!selectedAddress) {
                  toast.error("Please select a shipping address");
                  return;
                }
                if (paymentMethod === "online") {
                  handlecheckOutPayment(checkoutvalues?.totalItems);
                } else {
                  handleCreateOrderId();
                }
              }}
              className="bg-black cursor-pointer w-full rounded-md text-white py-2"
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
              ) : (
                "Pay Now"
              )}
            </button>
          </div>
        </div>
      </div>

      {editAddressPopUp && (
        <div className="fixed z-10 inset-0">
          <div className="flex justify-center items-center min-h-screen text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative bg-white z-60 text-gray-800 w-auto md:w-2xl px-2 py-4 rounded-md">
              <button
                className="float-right text-2xl absolute top-2 right-1 mb-2 cursor-pointer"
                onClick={() => setEditAddressPopUp(false)}
              >
                <IoClose />
              </button>
              <h1 className="text-2xl">Edit Address</h1>
              <div className="mt-4 px-3">
                <form onSubmit={handleEditAddress}>
                  <div className="flex flex-col space-y-4">
                    <div className="w-full flex justify-start">
                      <label className="flex items-center">
                        <span className="mr-2">Default Address</span>
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={editFormData?.isDefault}
                          onChange={(e) =>
                            setEditFormData((prev) => ({
                              ...prev,
                              isDefault: e.target.checked,
                            }))
                          }
                        />
                      </label>
                    </div>
                    
                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>Name</label>
                        <input
                          name="fullName"
                          value={editFormData?.fullName}
                          type="text"
                          onChange={handleEditInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>

                      <div className="flex flex-col w-full justify-start items-start">
                        <label>Phone</label>
                        <input
                          name="phoneNumber"
                          value={editFormData?.phoneNumber}
                          type="text"
                          onChange={handleEditInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>Street</label>
                        <input
                          name="street"
                          value={editFormData?.street}
                          type="text"
                          onChange={handleEditInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>

                      <div className="flex flex-col w-full justify-start items-start">
                        <label>City</label>
                        <input
                          name="city"
                          value={editFormData?.city}
                          type="text"
                          onChange={handleEditInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>State</label>
                        <input
                          name="state"
                          value={editFormData?.state}
                          type="text"
                          onChange={handleEditInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>

                      <div className="flex flex-col w-full justify-start items-start">
                        <label>Zip Code</label>
                        <input
                          name="pinCode"
                          value={editFormData?.pinCode}
                          type="text"
                          onChange={handleEditInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>Country</label>
                        <input
                          name="country"
                          value={"India"}
                          type="text"
                          readOnly
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start">
                      <label>Address Type</label>
                      <select
                        name="addressType"
                        className="border border-gray-600 px-2 py-1 w-full focus:outline-none"
                        value={editFormData.addressType}
                        onChange={handleEditInputChange}
                      >
                        <option value="" disabled>Select</option>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-c1 rounded-md cursor-pointer w-full mt-4 py-2 text-white"
                  >
                    {loader ? "Updating..." : "Update"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {addAddressPopUp && (
        <div className="fixed z-10 inset-0">
          <div className="flex justify-center items-center min-h-screen text-center">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="relative bg-white text-gray-800 z-60 w-auto md:w-2xl px-2 py-4 rounded-md">
              <button
                className="float-right text-2xl absolute top-2 right-1 mb-2 cursor-pointer"
                onClick={() => setAddAddressPopUp(false)}
              >
                <IoClose />
              </button>
              <h1 className="text-2xl">Add Address</h1>
              <div className="mt-4 px-3">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col space-y-4">
                    <div className="w-full flex justify-start">
                      <label className="flex items-center">
                        <span className="mr-2">Default Address</span>
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={addAddressForm?.isDefault}
                          onChange={(e) =>
                            setAddAddressForm((prev) => ({
                              ...prev,
                              isDefault: e.target.checked,
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>Name</label>
                        <input
                          name="fullName"
                          value={addAddressForm?.fullName}
                          type="text"
                          onChange={handleInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>

                      <div className="flex flex-col w-full justify-start items-start">
                        <label>Phone</label>
                        <input
                          name="phoneNumber"
                          value={addAddressForm?.phoneNumber}
                          type="number"
                          onChange={handleInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>Street</label>
                        <input
                          name="street"
                          value={addAddressForm?.street}
                          type="text"
                          onChange={handleInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>

                      <div className="flex flex-col w-full justify-start items-start">
                        <label>City</label>
                        <input
                          name="city"
                          value={addAddressForm?.city}
                          type="text"
                          onChange={handleInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>State</label>
                        <input
                          name="state"
                          value={addAddressForm?.state}
                          type="text"
                          onChange={handleInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>

                      <div className="flex flex-col w-full justify-start items-start">
                        <label>Pin Code</label>
                        <input
                          name="pinCode"
                          value={addAddressForm?.pinCode}
                          type="text"
                          onChange={handleInputChange}
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex w-full space-x-8 justify-between">
                      <div className="flex w-full flex-col justify-start items-start">
                        <label>Country</label>
                        <input
                          name="country"
                          value={"India"}
                          type="text"
                          readOnly
                          className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-start items-start">
                      <label>Address Type</label>
                      <select
                        name="addressType"
                        className="border border-gray-600 px-2 py-1 w-full focus:outline-none"
                        value={addAddressForm.addressType}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>Select</option>
                        <option value="home">Home</option>
                        <option value="work">Work</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-c1 rounded-md cursor-pointer w-full mt-4 py-2 text-white"
                  >
                    {loader ? "Adding..." : "Add Address"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {successPopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all animate-scaleIn">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold text-gray-900">Order Confirmed!</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Your order has been placed successfully. We've sent a
                    confirmation to your email.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSuccessPopUp(false);
                  navigate("/my-account?tab=tab-1", { replace: true });
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                View Orders
              </button>
              <button
                onClick={() => {
                  setSuccessPopUp(false);
                  navigate("/", { replace: true });
                }}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutPage;