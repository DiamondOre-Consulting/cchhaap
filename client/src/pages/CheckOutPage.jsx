import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  userBuyNowCheckOutValues,
  userGetCheckoutValues,
} from "../Redux/Slices/checkoutSlice";
import { IoClose } from "react-icons/io5";
import {
  userAddNewAddress,
  userDeleteAddress,
  userEditAddress,
  userGetAllAddress,
} from "@/Redux/Slices/authSlice";
import { IoIosAdd } from "react-icons/io";
import { toast } from "sonner";
import { FaPhoneAlt } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  userApplyCoupon,
  userBuyNowCoupon,
} from "../Redux/Slices/coupon.Slice";
import { RxCross1 } from "react-icons/rx";
import confetti from "canvas-confetti";
import {
  userCheckoutPayment,
  userGetRazorpayKey,
  userVarifyPayment,
} from "../Redux/Slices/paymentSlice";
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
  const [paymentMethod, setPaymentMethod] = useState("online");
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
      console.log("checkout value", response);
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
      console.log("buy now checout value", response);
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
      const {
        fullName,
        phoneNumber,
        street,
        city,
        state,
        country = "India",
        pinCode,
      } = addAddressForm;

      if (
        !fullName ||
        !phoneNumber ||
        !street ||
        !city ||
        !state ||
        !country ||
        !pinCode
      ) {
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
          return toast.error(
            "Payment system is not available. Try again later."
          );
        }

        const options = {
          key: razorpayKey,
          amount: response?.payload?.data?.amount,
          currency: response?.payload?.data?.currency,
          name: "CHHAAPP",
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

              navigate("/my-account?tab=tab-2", { replace: true });
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


  console.log("checkout value",checkoutvalues)
  return (
    <div className="min-h-screen bg-[#6d0c04] text-white py-8 px-4 md:px-8">
     
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Checkout</h1>
        <div className="flex items-center mt-2 text-amber-100">
          <span className="text-sm">Cart</span>
          <span className="mx-2">›</span>
          <span className="text-sm font-medium text-white">Delivery</span>
          <span className="mx-2">›</span>
          <span className="text-sm">Payment</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Delivery Address */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address Section */}
          <div className="bg-[#8a1c0b] rounded-xl p-6 shadow-lg border border-amber-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Delivery Address
              </h2>
              <button
                onClick={() => setAddAddressPopUp(true)}
                className="flex items-center cursor-pointer space-x-1 bg-c1  px-4 py-2 rounded-lg transition-colors text-white"
              >
                <IoIosAdd className="text-lg" />
                <span>Add New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allAddress?.addresses?.map((address, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedAddress?._id === address._id
                      ? "border-amber-500 bg-[#7a1505]"
                      : "border-amber-900 hover:bg-[#7a1505]"
                  }`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      className="mt-1 mr-2 accent-amber-600"
                      checked={selectedAddress?._id === address._id}
                      onChange={() => {}}
                    />
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-medium text-white">
                          {address.fullName}
                        </h3>
                        {address.isDefault && (
                          <span className="bg-amber-700 text-white text-xs px-2 py-1 rounded ml-2">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-amber-100 text-sm mt-1">
                        {address.street}, {address.city}, {address.state} -{" "}
                        {address.pinCode}
                      </p>
                      <p className="flex items-center text-amber-100 text-sm mt-2">
                        <FaPhoneAlt className="mr-1" />
                        {address.phoneNumber}
                      </p>
                      <div className="flex space-x-3 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(address);
                          }}
                          className="text-amber-300 hover:text-amber-200 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address._id);
                          }}
                          className="text-amber-300 hover:text-amber-200 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

       
         
        </div>

        <div className="space-y-6">
          <div className="bg-[#8a1c0b] rounded-xl p-6 shadow-lg border border-amber-900">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-amber-100">
                 Total Items ({checkoutvalues?.totalItems})
                </span>
             
              </div>
                  <div className="flex justify-between">
                <span className="text-amber-100">Total MRP</span>
                 <span className="text-white">
                  {checkoutvalues?.totalMRP.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-100">Discount</span>
                <span className="text-green-300">
                  -
                  {checkoutvalues?.totalDiscountedPrice.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "INR",
                    }
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex flex-col gap-1">
                  <span className="text-amber-100 font-medium">
                    Shipping Cost
                  </span>
                  <span className="text-gray-200 text-[14px]">
                    All taxes included
                  </span>
                </div>
                <span className="text-white font-medium">
                  {checkoutvalues?.shippingCost.toLocaleString("en-US", {
                    style: "currency",
                    currency: "INR",
                  })}
                </span>
              </div>
              {couponValue && (
                <div className="flex justify-between">
                  <span className="text-amber-100">Coupon Discount</span>
                  <span className="text-green-300">
                    -
                    {couponValue.discountAfterApplyingCoupon?.toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "INR",
                      }
                    )}
                  </span>
                </div>
              )}
              <div className="border-t border-amber-900 pt-3 flex justify-between font-medium">
                <span className="text-white">Total Amount</span>
                <span className="text-white">
                  {couponValue
                    ? couponValue?.amountAfterApplyingCoupon?.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "INR",
                        }
                      )
                    : checkoutvalues?.totalPriceAfterDiscount?.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "INR",
                        }
                      )}
                </span>
              </div>
            </div>

         
            <div className="mt-6">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="w-full bg-[#6d0c04] border border-[#edb141] text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder-amber-200"
                    value={tempCouponName}
                    onChange={(e) => setTempCouponName(e.target.value)}
                  />
                  {tempCouponName && (
                    <button
                      onClick={() => {
                        setTempCouponName("");
                        setCouponValue(null);
                      }}
                      className="absolute right-3 top-2.5 text-amber-300 hover:text-white"
                    >
                      <RxCross1 />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (productId) {
                      handleBuyNowCouponApply();
                    } else {
                      handleApplyCoupon();
                    }
                  }}
                  className="bg-c1  px-4 py-2 rounded-lg cursor-pointer transition-colors text-white"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <div className="bg-[#8a1c0b] rounded-xl p-6 shadow-lg border border-[#edb141]/20">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Payment Options
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("online")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  paymentMethod === "online"
                    ? "border-[#edb141] bg-[#7a1505]"
                    : "border-[#edb141]/20 hover:bg-[#7a1505]"
                }`}
              >
                <div className="flex items-center">
                  <SiRazorpay className="text-2xl text-blue-400 mr-3" />
                  <span className="text-white">Pay with Razorpay</span>
                </div>
                {paymentMethod === "online" && (
                  <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  </div>
                )}
              </button>
              {/* <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  paymentMethod === "cod"
                    ? "border-amber-500 bg-[#7a1505]"
                    : "border-amber-900 hover:bg-[#7a1505]"
                }`}
              >
                <div className="flex items-center">
                  <IoIosCash className="text-2xl text-yellow-400 mr-3" />
                  <span className="text-white">Cash on Delivery</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  </div>
                )}
              </button> */}
            </div>

            {/* Pay Now Button */}
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
              disabled={loader}
              className={`w-full mt-6 py-3 text-c1 rounded-lg cursor-pointer font-medium flex items-center justify-center ${
                loader ? "bg-[#edb141]" : "bg-[#edb141] "
              } transition-colors text-white`}
            >
              {loader ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Pay ${
                  couponValue
                    ? couponValue?.amountAfterApplyingCoupon?.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "INR",
                        }
                      )
                    : checkoutvalues?.totalPriceAfterDiscount?.toLocaleString(
                        "en-US",
                        {
                          style: "currency",
                          currency: "INR",
                        }
                      )
                }`
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
                        <option value="" disabled>
                          Select
                        </option>
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
                        <option value="" disabled>
                          Select
                        </option>
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
                <h3 className="text-xl font-semibold text-gray-900">
                  Order Confirmed!
                </h3>
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
                  navigate("/my-account?tab=tab-2", { replace: true });
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                View Orders
              </button>
              <button
                onClick={() => {
                  setSuccessPopUp(false);
                  navigate("/my-account?tab=tab-2", { replace: true });
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
