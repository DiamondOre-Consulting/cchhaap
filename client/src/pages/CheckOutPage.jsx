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
userAddNewAddress;
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
import {
  getNavbarCartWishlistCount,
  userUpdateCart,
} from "../Redux/Slices/cart";

const CheckOutPage = () => {
  const dispatch = useDispatch();
  const [checkoutvalues, setCheckOutValues] = useState();
  // const [buyNowCheckOutValues, setBuyNowCheckOutValues] = useState();
  const [addressId, setAddressId] = useState();
  const [loader, setLoader] = useState(false);
  const [editAddressPopUp, setEditAddressPopUp] = useState(false);
  const [addAddressPopUp, setAddAddressPopUp] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [successPopUp, setSuccessPopUp] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
   const productId = queryParams.get('product');
  const variationId = queryParams.get('variation');
  const quantity = Number(queryParams.get('quantity')) || 1; 

  console.log("detailssssssss", productId);
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
      console.log("alll values ", response);
      setCheckOutValues(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBuyNowCheckOutValues = async () => {
    try {
      const response = await dispatch(userBuyNowCheckOutValues({ productId , variationId , quantity}));
      console.log("buynowcheckoutvalue", response);
      setCheckOutValues(response?.payload?.data?.data?.checkoutValues);
      console.log("this is ", checkoutvalues);
    } catch (error) {
      console.log(error);
    }
  };
  const cartItems = useSelector((state) => state.cart.cartItems);
  console.log("cart items sdjkhsd", cartItems);

  useEffect(() => {
    // if(cartItems.length === 0 ){
    //   navigate('/');
    //   return
    // }

    if (productId) {
      handleGetBuyNowCheckOutValues();
    } else {
      handleGetCheckOutValue();
    }
  }, [productId, cartItems]);

  console.log(checkoutvalues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // console.log(addAddressForm);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    console.log("adding adress function");
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
        console.log("country data", country);
        toast.error("Please fill all required fields.");
        setLoader(false);
        return;
      }

      if (
        (
          fullName ||
          phoneNumber ||
          street ||
          city ||
          state ||
          country ||
          pinCode
        ).length <= 2
      ) {
        toast.error("please enter valid details");
        return;
      }
      console.log(pinCode);
      console.log(pinCode.length);

      if (pinCode.length !== 6) {
        toast.error("please enter valid pincode");
        return;
      }

      console.log(phoneNumber);
      console.log(phoneNumber.length);

      if (phoneNumber.length !== 10) {
        toast.error("please enter valid phone number");
        return;
      }

      const response = await dispatch(userAddNewAddress(addAddressForm));
      console.log(response);
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
  const [selectedAddress, setSelectedAddress] = useState("");
  const handleGetAllAddress = async () => {
    try {
      const response = await dispatch(userGetAllAddress());
      console.log("all address data ", response?.payload?.data);
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

  console.log("iis selcted address", selectedAddress);
  const handleEditClick = (address) => {
    setEditFormData(address);
    setAddressId(address?._id);
    setEditAddressPopUp(true);
  };

  const handleEditInputChange = (e) => {
    let { name, value } = e.target;
    // value = value === "true";

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("edit form dataaaaa is ", editFormData, addressId);

  useEffect(() => {
    handleGetAllAddress();
  }, [dispatch]);

  const handleEditAddress = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await dispatch(
        userEditAddress({ addressId, editFormData })
      );
      console.log(response);
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
      const response = await dispatch(userDeleteAddress(addressId));
      console.log(response);
      await handleGetAllAddress();
    } catch (error) {
      console.log(error);
    }
  };

  let [couponName, setCouponName] = useState();
  let [tempCouponName, setTempCouponName] = useState();
  const [couponValue, setCouponValue] = useState();

  const handleApplyCoupon = async (e) => {
    // e.preventDefault();
    try {
      if (couponName === "") {
        toast.error("please enter coupon Code");
        return;
      }
      // console.log(tempCouponName)
      setCouponName(tempCouponName);
      const res = await dispatch(userApplyCoupon(tempCouponName));
      console.log("this is response", res);
      if (res?.payload?.statusCode === 200) {
        setCouponValue(res?.payload?.data);
        handleConfetti();
      }
      // setCouponValue(res?.payload?.data);
    } catch (error) {
      console.log(error);
      setCouponValue("");
    }
  };

  const handleBuyNowCouponApply = async (e) => {
    // e.preventDefault();
    console.log("buy now coupon");
    try {
      console.log("name", couponName, tempCouponName);
      setCouponName(tempCouponName);
      // couponName = tempCouponName
      console.log("tempcoupon name ", tempCouponName);
      if (couponName === "") {
        toast.error("please enter coupon Code");
        return;
      }
      const res = await dispatch(userBuyNowCoupon({ couponName, productId , variationId }));
      if (res?.payload?.statusCode === 200) {
        setCouponValue(res?.payload?.data);
        handleConfetti();
      }
      console.log("this is ressssponse", res);
      // setCouponValue(res?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [razorpayKey, setRazorpayKey] = useState();
  const handleGetRazorpayKey = async () => {
    try {
      const response = await dispatch(userGetRazorpayKey());
      setRazorpayKey(response?.payload?.data?.key);
      console.log("rezorpay key its is", response, razorpayKey);
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

  // const totalItems = checkoutvalues?.totalItems
  const [checkOutPaymentValues, setCheckOutPaymentValues] = useState();
  const [paymentMethod, setPaymentMethod] = useState(null);
  console.log(paymentMethod);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const handlecheckOutPayment = async (totalItems) => {
    try {
      if (paymentMethod == null) {
        toast.error("please Select Payment Method");
        return;
      }
      setLoader(true);
      console.log(totalItems);
      console.log("name of the coupon ", couponName);
      const response = await dispatch(
        userCheckoutPayment({ couponName, totalItems, productId })
      );
      console.log("this is checkoutvalue", response);
      setCheckOutPaymentValues(response?.payload?.data);
      if (!paymentMethod) {
        toast.error("please select Payment Method");
        return;
      }
      if (!razorpayKey) {
        console.log("Fetching Razorpay key again...");
        await handleGetRazorpayKey();
      }
      console.log("amounttttttttttt", response?.payload?.data?.amount);

      if (!razorpayKey) {
        console.error("Razorpay key is missing");
        return toast.error("Payment system is not available. Try again later.");
      }

      if (paymentMethod === "online") {
        console.log(paymentMethod, "updating ");
        setPaymentStatus("paid");
      }

      if (!selectedAddress) {
        toast.error("please select the shipping address");
        return;
      }

      const options = {
        key: razorpayKey,
        amount: response?.payload?.data?.amount,
        currency: response?.payload?.data?.currency,
        name: "Panjab Jewellers",
        description: "",
        image: "",
        order_id: response?.payload?.data?.id,
        handler: async function (res) {
          paymentDetails.razorpay_payment_id = res.razorpay_payment_id;
          paymentDetails.razorpay_order_id = res.razorpay_order_id;
          paymentDetails.razorpay_signature = res.razorpay_signature;

          const response = await dispatch(userVarifyPayment(paymentDetails));
          console.log("verify payment route ", response);
          if (response?.payload?.success === true) {
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
                paymentMethod,
                paymentStatus,
              })
            );

            console.log(
              "order is being creating ",
              couponName,
              productId,
              selectedAddress,
              paymentMethod,
              paymentStatus
            );

            navigate("/my-account/orders", { replace: true });
            // await dispatch(userUpdateCart([]))
            await dispatch(getNavbarCartWishlistCount());
            console.log(res);
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
      if (
        typeof window.Razorpay !== "undefined" &&
        paymentMethod === "online"
      ) {
        const razor = new window.Razorpay(options);

        razor.open();
      } else {
        console.error("Razorpay script not loaded");
        toast.error("Payment gateway is not available. Try again later.");
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
      if (paymentMethod == null) {
        toast.error("please select the payment method");
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

      console.log("this is response of cod", res);

      if (res?.payload?.statusCode === 200) {
        console.log("create code orderid");
        toast.success(res?.payload?.message);

        // await handleGetCheckOutValue();
        // await handleGetBuyNowCheckOutValues();
        setSuccessPopUp(true);
        await dispatch(getNavbarCartWishlistCount());
        // dispatch(userUpdateCart([]));
        // await dispatch(userUpdateCart([]))
        // dispatch(userUpdateCart([]));
        // navigate('/my-account/orders');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      // setSuccessPopUp(false);
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col  md:flex-row px-4 md:px-10 justify-between md:space-y-0 space-y-4 md:space-x-8">
        <div className=" shadow-xl md:min-w-4xl p-4 myfont">
          <div>
            <div className="flex  justify-between">
              <p className="text-xl underline font-bold">
                Select Delivery Address
              </p>

              <p
                onClick={() => setAddAddressPopUp(true)}
                className=" cursor-pointer flex items-center text-sm md:text-md bg-c2 text-c1 font-bold px-1 md:px-6 py-2  "
              >
                <IoIosAdd className="text-c1 z-40" /> Address
              </p>
            </div>

            <div>
              {allAddress?.addresses?.map((address, index) => (
                <div key={index} className="mt-4 md:w-xl">
                  <div className="flex space-x-2">
                    <input
                      type="radio"
                      className="w-4"
                      checked={address?.isDefault}
                    />
                    <p>{address?.fullName}</p>
                  </div>
                  <p>
                    {address?.street}, {address?.city} , {address?.state} ,
                    {address?.pinCode} , {address?.country}
                  </p>
                  <p className="flex  items-center space-x-2">
                    <FaPhoneAlt />
                    <span>{address?.phoneNumber}</span>
                  </p>
                  <div className="flex space-x-4 text-c1 mt-2">
                    <button
                      className="bg-c2  px-6 py-2  cursor-pointer"
                      onClick={() => handleEditClick(address)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address?._id)}
                      className=" cursor-pointer bg-white px-6 py-2 "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className=" shadow-xl bg-white rounded text-c1 myfont w-full py-3">
          <p className="font-bold text-center text-xl underline">
            Delivery Estimates
          </p>

          <div className="mt-4 text-lg space-y-2 px-4">
            <p>Total Items ({checkoutvalues?.totalItems})</p>
            <div className="flex  justify-between">
              <p>Total MRP </p>
              <p>
                {checkoutvalues?.totalMRP.toLocaleString("en-US", {
                  style: "currency",
                  currency: "INR",
                })}
              </p>
              {/* <p>₹{checkoutvalues?.totalMRP}</p> */}
            </div>

            <div className="flex  justify-between">
              <p>Discount</p>
              <p>
                -
                {checkoutvalues?.totalDiscountedPrice.toLocaleString(
                  "en-US",
                  {
                    style: "currency",
                    currency: "INR",
                  }
                )}
              </p>
            </div>

            <div className="flex my-3 space-x-4 items-center justify-between">
              <div className="relative flex items-center justify-end">
                <input
                  onChange={(e) => setTempCouponName(e.target.value)}
                  value={tempCouponName}
                  className="border border-gray-400 px-2 rounded-md w-full "
                  type="text"
                  placeholder="Apply Coupon Code  "
                />
                <RxCross1
                  className="absolute text-sm  mr-2 cursor-pointer"
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
                className="bg-black cursor-pointer  text-white py-2 px-4 text-sm rounded-md"
              >
                Apply
              </button>
            </div>

            {couponValue && (
              <div className="flex justify-between">
                <p>Coupon applied</p>
                <p className="text-green-600">
                  {couponValue.discountAfterApplyingCoupon?.toLocaleString(
                    "en-US",
                    {
                      style: "currency",
                      currency: "INR",
                    }
                  )}
                </p>
              </div>
            )}

            <div className="flex  border-t-2  py-2 justify-between">
              <p>Total Amount</p>
              <p>
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
              </p>
            </div>

            <div className="flex justify-between space-x-4 items-center">
              <div
                onClick={() => setPaymentMethod("online")}
                className={`border py-2 cursor-pointer text-white text-center flex justify-center items-center w-full ${
                  paymentMethod === "online"
                    ? "border-4 border-blue-500"
                    : "border-blue-900"
                } bg-blue-900`}
              >
                <SiRazorpay />
                Razerpay
              </div>
              <div
                onClick={() => {
                  setPaymentMethod("cod");
                }}
                className={`border py-2 cursor-pointer flex justify-center items-center w-full text-white bg-yellow-600 space-x-1 ${
                  paymentMethod === "cod" ? "border-4 border-yellow-500" : ""
                }`}
              >
                {" "}
                <IoIosCash />
                <span>COD</span>{" "}
              </div>
            </div>
            <button
              onClick={() => {
                if (paymentMethod === "online") {
                  handlecheckOutPayment(checkoutvalues?.totalItems);
                } else {
                  handleCreateOrderId();
                }
              }}
              className="bg-black cursor-pointer  w-full  rounded-md text-white py-2 "
            >
              {loader ? (
                <div role="status" className="flex items-center justify-center">
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
                "Pay Now"
              )}
            </button>
          </div>
        </div>
      </div>

      {editAddressPopUp && (
        <>
          <div className="fixed z-10 inset-0 ">
            <div className="flex justify-center items-center min-h-screen text-center">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              </div>

              <div className="relative bg-white z-60 text-gray-800 w-auto md:w-2xl px-2 py-4 rounded-md">
                <div
                  className="float-right text-2xl absolute top-2 right-1 mb-2 cursor-pointer"
                  onClick={() => setEditAddressPopUp(false)}
                >
                  <IoClose />
                </div>
                <h1 className="text-2xl ">Edit Address</h1>
                <div className="mt-4 px-3">
                  <form onSubmit={handleEditAddress}>
                    <div className="flex flex-col space-y-4">
                      <div className="w-full flex justify-start">
                        <p>
                          <span> Default Address </span>
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
                        </p>
                      </div>
                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>Name</label>
                          <input
                            name="fullName"
                            value={editFormData?.fullName}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>phone</label>
                          <input
                            name="phoneNumber"
                            value={editFormData?.phoneNumber}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>Street</label>
                          <input
                            name="street"
                            value={editFormData?.street}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>City</label>
                          <input
                            name="city"
                            value={editFormData?.city}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>State</label>
                          <input
                            name="state"
                            value={editFormData?.state}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>Zip Code</label>
                          <input
                            name="pinCode"
                            value={editFormData?.pinCode}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>Country</label>
                          <input
                            name="country"
                            value={"India"}
                            type="text"
                            // onChange={handleEditInputChange}
                            // onChange={(e) => setSelectedCategoryName(e.target.value)}

                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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
                        "Update"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {addAddressPopUp && (
        <>
          <div className="fixed z-10 inset-0 ">
            <div className="flex justify-center items-center min-h-screen text-center">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              </div>

              <div className="relative bg-white text-gray-800 z-60 w-auto md:w-2xl px-2 py-4 rounded-md">
                <div
                  className="float-right text-2xl absolute top-2 right-1 mb-2 cursor-pointer"
                  onClick={() => setAddAddressPopUp(false)}
                >
                  <IoClose />
                </div>
                <h1 className="text-2xl ">Add Address</h1>
                <div className="mt-4 px-3">
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col space-y-4">
                      <div className="w-full flex justify-start">
                        <p>
                          <span> Default Address </span>
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
                        </p>
                      </div>

                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>Name</label>
                          <input
                            name="fullName"
                            value={addAddressForm?.fullName}
                            type="text"
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>phone</label>
                          <input
                            name="phoneNumber"
                            value={addAddressForm?.phoneNumber}
                            type="number"
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>Street</label>
                          <input
                            name="street"
                            value={addAddressForm?.street}
                            type="text"
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>City</label>
                          <input
                            name="city"
                            value={addAddressForm?.city}
                            type="text"
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>State</label>
                          <input
                            name="state"
                            value={addAddressForm?.state}
                            type="text"
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>Pin Code</label>
                          <input
                            name="pinCode"
                            value={addAddressForm?.pinCode}
                            type="text"
                            onChange={handleInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex w-full space-x-8 justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>Country</label>
                          <input
                            name="country"
                            value={"India"}
                            type="text"
                            // onChange={handleInputChange}
                            className="w-full border-b-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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
                        "Add Address"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {successPopUp && (
        <div class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    class="h-6 w-6 text-green-600"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Order Placed Successfully
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm leading-5 text-gray-500">
                      Order Placed Successfully we will reach out to soon
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <span class="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                  <button
                    onClick={() => {
                      setSuccessPopUp(false);
                      navigate("/my-account/orders", { replace: true });
                    }}
                    type="button"
                    class="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                  >
                    Done
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckOutPage;
