import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { FaPhoneAlt } from "react-icons/fa";
import { IoIosAdd, IoIosCash } from "react-icons/io";
import { SiRazorpay } from "react-icons/si";
import { IoClose } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
// import { getNavbarCartCount } from "@/redux/slices/cartSlice";
import { toast } from "sonner";
import {
  userAddNewAddress,
  userDeleteAddress,
  userEditAddress,
  userGetAllAddress,
} from "@/Redux/Slices/authSlice";
import { userGetCheckoutValues } from "@/Redux/Slices/checkoutSlice";

const steps = [
  {
    step: 1,
    title: "Cart",
    description: "Review your items",
  },
  {
    step: 2,
    title: "Address",
    description: "Select delivery address",
  },
  {
    step: 3,
    title: "Payment",
    description: "Choose payment method",
  },
];

const CheckOutPage = () => {
  const [activeStep, setActiveStep] = useState(1);
  const dispatch = useDispatch();
  const [checkoutvalues, setCheckOutValues] = useState();
  const [addressId, setAddressId] = useState();
  const [loader, setLoader] = useState(false);
  const [editAddressPopUp, setEditAddressPopUp] = useState(false);
  const [addAddressPopUp, setAddAddressPopUp] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [successPopUp, setSuccessPopUp] = useState(false);
  console.log("alladdress", allAddress);
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const productId = queryParams.get("product");

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
      console.log("checkout value",response)
      setCheckOutValues(response?.payload?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBuyNowCheckOutValues = async () => {
    try {
      const response = await dispatch(userBuyNowCheckOutValues({ productId }));
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

      if (pinCode.length !== 6) {
        toast.error("please enter valid pincode");
        return;
      }

      if (phoneNumber.length !== 10) {
        toast.error("please enter valid phone number");
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

  const [selectedAddress, setSelectedAddress] = useState("");
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
    let { name, value } = e.target;
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
      const response = await dispatch(
        userEditAddress({ addressId, editFormData })
      );
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
      await handleGetAllAddress();
    } catch (error) {
      console.log(error);
    }
  };

  let [couponName, setCouponName] = useState();
  let [tempCouponName, setTempCouponName] = useState();
  const [couponValue, setCouponValue] = useState();

  const handleApplyCoupon = async (e) => {
    try {
      if (couponName === "") {
        toast.error("please enter coupon Code");
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

  const handleBuyNowCouponApply = async (e) => {
    try {
      setCouponName(tempCouponName);
      if (couponName === "") {
        toast.error("please enter coupon Code");
        return;
      }
      const res = await dispatch(userBuyNowCoupon({ couponName, productId }));
      if (res?.payload?.statusCode === 200) {
        setCouponValue(res?.payload?.data);
        handleConfetti();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [razorpayKey, setRazorpayKey] = useState();
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

  const [checkOutPaymentValues, setCheckOutPaymentValues] = useState();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  const handleNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

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
      setCheckOutPaymentValues(response?.payload?.data);
      if (!paymentMethod) {
        toast.error("please select Payment Method");
        return;
      }
      if (!razorpayKey) {
        console.log("Fetching Razorpay key again...");
        await handleGetRazorpayKey();
      }

      if (!razorpayKey) {
        console.error("Razorpay key is missing");
        return toast.error("Payment system is not available. Try again later.");
      }

      if (paymentMethod === "online") {
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

            navigate("/my-account/orders", { replace: true });
            // await dispatch(getNavbarCartCount());
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

      if (res?.payload?.statusCode === 200) {
        toast.success(res?.payload?.message);
        setSuccessPopUp(true);
        await dispatch(getNavbarCartCount());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className=" p-4 max-w-6xl mx-auto">
            <div className="flex gap-x-6">
              <div className="flex w-full flex-col">
                <div className="flex border  border-white/30 text-sm px-4 rounded py-4 justify-between items-center ">
                  <p>Review Your Cart </p>
                  <div className="flex items-center space-x-4">
                    <p>Remove</p>
                    <div className="h-4 w-[1px] bg-white"></div>
                    <p>Move to Wishlist</p>
                  </div>
                </div>

                <div className="flex flex-col border border-white/20 p-4 mt-10">
                  <div className="flex    gap-x-4 items-center">
                    <img
                      src="https://shopmulmul.com/cdn/shop/files/2_dd55b873-fc4f-4601-ae43-f44a0b851462.jpg?v=1752212130&width=700"
                      className="max-h-32 object-cover "
                      alt=""
                    />
                    <div className="flex  w-full justify-between">
                      <div className="flex flex-col">
                        <p className="text-sm">Elusha Lime Organza Kura Set</p>
                        <p>XS || XS</p>

                        <div className="flex items-end w-full gap-x-4 mt-2">
                          <div className="flex items-center w-full border mt-1 border-white/40 px-4  max-w-[200px] justify-between text-white/50">
                            <button
                              type="button"
                              // onClick={() => setQty(Math.max(qty - 1, 0))}
                              className="text-2xl font-bold px-2 cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-lg">3</span>
                            <button
                              type="button"
                              // onClick={() => setQty(qty + 1)}
                              className="text-2xl font-bold px-2 cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <p className="underline text-xs text-white/40">
                            Remove
                          </p>
                        </div>
                      </div>

                      <div>₹ 100,00</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-y-3 flex-col w-full max-w-sm mx-auto">
                <div className="flex">
                  <form class="w-full mx-auto">
                    <label
                      for="default-search"
                      class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                      Search
                    </label>
                    <div class="relative">
                      <input
                        type="search"
                        onChange={(e) => setTempCouponName(e.target.value)}
                        value={tempCouponName}
                        id="default-search"
                        class="block w-full p-4 ps-4 text-sm text-c2 border border-white/40 rounded bg-transparent  focus:outline-none"
                        placeholder="Search Coupons..."
                        required
                      />
                      <button
                        onClick={() => {
                          if (productId) {
                            handleBuyNowCouponApply();
                          } else {
                            handleApplyCoupon();
                          }
                        }}
                        type="submit"
                        class="text-green-700 absolute end-2.5 bottom-2.5   font-medium rounded text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        check
                      </button>
                    </div>
                  </form>
                </div>
                <div className=" w-full border p-4 rounded border-white/40   ">
                  <p className="uppercase">Price Details ({checkoutvalues?.totalItems})</p>
                  <div className="flex gap-y-2 text-sm mt-6 flex-col">
                    <div className="flex justify-between">
                      <p>Total MRP</p>
                     
                      <p>{checkoutvalues?.totalMRP.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>

                    <div className="flex justify-between">
                      <p>Discount On MRP</p>
                      <p>{checkoutvalues?.totalDiscountedPrice?.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>

                    {/* <div className="flex justify-between">
                      <p>Coupon Discount</p>
                      <p>₹234</p>
                    </div> */}
                    {/* <div className="flex justify-between">
                      <p>Plateform Fee</p>
                      <p>₹20</p>
                    </div> */}

                    <div className="flex border-t border-white/40 py-2 justify-between">
                      <p>Total Amount</p>
                      <p>{checkoutvalues?.totalPriceAfterDiscount.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="bg-c2 w-full text-black py-2 mt-4"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className=" p-4 max-w-6xl mx-auto">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-4">
                Select Delivery Address
              </h2>
              <button
                onClick={() => setAddAddressPopUp(true)}
                className="cursor-pointer flex items-center text-sm bg-c2 rounded  text-c1 font-bold px-4 py-1"
              >
                <IoIosAdd className="" /> Add Address
              </button>
            </div>

            <div className="mt-10 gap-x-4 w-full flex  ">
              <div className="w-full border border-white/40 p-2">
                {allAddress?.addresses?.map((address, index) => (
                  <div
                    key={index}
                    className={`mt-4 flex justify-between  items-center ${
                      index % 2 === 0 ? "border-b pb-3 border-white/20 " : ""
                    }  `}
                  >
                    <div>
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
                        {address?.street}, {address?.city} , {address?.state} ,
                        {address?.pinCode} , {address?.country}
                      </p>
                      <p className="flex items-center space-x-2">
                        <FaPhoneAlt />
                        <span>{address?.phoneNumber}</span>
                      </p>
                    </div>
                    <div className="flex space-x-4 text-white ">
                      <button
                        className="bg-c2 text-c1 px-6 py-1 cursor-pointer"
                        onClick={() => handleEditClick(address)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address?._id)}
                        className="cursor-pointer bg-c2 text-c1 px-6 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="min-w-sm mx-auto">
                  <div className=" w-full border p-4 rounded border-white/40   ">
                  <p className="uppercase">Price Details ({checkoutvalues?.totalItems})</p>
                  <div className="flex gap-y-2 text-sm mt-6 flex-col">
                    <div className="flex justify-between">
                      <p>Total MRP</p>
                     
                      <p>{checkoutvalues?.totalMRP.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>

                    <div className="flex justify-between">
                      <p>Discount On MRP</p>
                      <p>{checkoutvalues?.totalDiscountedPrice?.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>

                    {/* <div className="flex justify-between">
                      <p>Coupon Discount</p>
                      <p>₹234</p>
                    </div> */}
                    {/* <div className="flex justify-between">
                      <p>Plateform Fee</p>
                      <p>₹20</p>
                    </div> */}

                    <div className="flex border-t border-white/40 py-2 justify-between">
                      <p>Total Amount</p>
                      <p>{checkoutvalues?.totalPriceAfterDiscount.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="bg-c2 w-full text-black py-2 mt-4"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevStep}
                className="bg-c2 px-4 py-2 rounded text-c1"
              >
                Back to Cart
              </button>
              <button
                onClick={handleNextStep}
                className="bg-c2 text-c1 px-4 py-2 rounded"
                disabled={!selectedAddress}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex gap-x-4 max-w-6xl mx-auto">
            <div className=" myfont w-full py-3">
              <h2 className="font-bold text-center text-xl  mb-4">
               Select Payment Method
              </h2>
              <div>
                <div className="flex  flex-col justify-between  items-center">
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
                    onClick={() => setPaymentMethod("cod")}
                    className={`border py-2 cursor-pointer flex justify-center items-center w-full text-white bg-yellow-600 space-x-1 ${
                      paymentMethod === "cod"
                        ? "border-4 border-yellow-500"
                        : ""
                    }`}
                  >
                    <IoIosCash />
                    <span>COD</span>
                  </div>
                </div>
              </div>
              {/* <div className="mt-4 text-lg space-y-2 px-4">
                <p>Total Items ({checkoutvalues?.totalItems})</p>
                <div className="flex justify-between">
                  <p>Total MRP </p>
                  <p>₹{checkoutvalues?.totalMRP}</p>
                </div>

                <div className="flex justify-between">
                  <p>Discount</p>
                  <p className="text-green-600">
                    -₹{checkoutvalues?.totalDiscountedPrice}
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
                      -₹{couponValue?.discountAfterApplyingCoupon}
                    </p>
                  </div>
                )}

                <div className="flex border-t-2 py-2 justify-between">
                  <p>Total Amount</p>
                  <p>
                    ₹
                    {couponValue
                      ? couponValue?.amountAfterApplyingCoupon
                      : checkoutvalues?.totalPriceAfterDiscount}
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
                    onClick={() => setPaymentMethod("cod")}
                    className={`border py-2 cursor-pointer flex justify-center items-center w-full text-white bg-yellow-600 space-x-1 ${
                      paymentMethod === "cod"
                        ? "border-4 border-yellow-500"
                        : ""
                    }`}
                  >
                    <IoIosCash />
                    <span>COD</span>
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
                  className="bg-black cursor-pointer w-full rounded-md text-white py-2"
                  disabled={!paymentMethod}
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
                    "Place Order"
                  )}
                </button>

                <button
                  onClick={handlePrevStep}
                  className="bg-gray-300 px-4 py-2 rounded w-full mt-2"
                >
                  Back to Address
                </button>
              </div> */}
            </div>
            <div>
              <div className="min-w-sm mx-auto">
                    <div className=" w-full border p-4 rounded border-white/40   ">
                  <p className="uppercase">Price Details ({checkoutvalues?.totalItems})</p>
                  <div className="flex gap-y-2 text-sm mt-6 flex-col">
                    <div className="flex justify-between">
                      <p>Total MRP</p>
                     
                      <p>{checkoutvalues?.totalMRP.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>

                    <div className="flex justify-between">
                      <p>Discount On MRP</p>
                      <p>{checkoutvalues?.totalDiscountedPrice?.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>

                    {/* <div className="flex justify-between">
                      <p>Coupon Discount</p>
                      <p>₹234</p>
                    </div> */}
                    {/* <div className="flex justify-between">
                      <p>Plateform Fee</p>
                      <p>₹20</p>
                    </div> */}

                    <div className="flex border-t border-white/40 py-2 justify-between">
                      <p>Total Amount</p>
                      <p>{checkoutvalues?.totalPriceAfterDiscount.toLocaleString("en-US" , {
                        style:"currency",
                        currency:"INR"
                      })}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="bg-c2 w-full text-black py-2 mt-4"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6">
      <div className="space-y-8 text-center mt-10">
        <Stepper defaultValue={activeStep}>
          {steps.map(({ step, title, description }) => (
            <StepperItem
              key={step}
              step={step}
              className="relative flex-1 flex-col!"
            >
              <StepperTrigger className="flex-col gap-3 rounded">
                <StepperIndicator />
                <div className="space-y-0.5 px-2">
                  <StepperTitle>{title}</StepperTitle>
                  <StepperDescription className="max-sm:hidden">
                    {description}
                  </StepperDescription>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>

      <div className="px-4 md:px-10 mt-8">{renderStepContent()}</div>

      {/* Address Popup Modals */}
      {editAddressPopUp && (
        <>
          <div className="fixed z-10 inset-0 ">
            <div className="flex justify-center items-center min-h-screen text-center">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              </div>

              <div className="relative bg-white text-c1 z-60 w-auto md:w-2xl px-2 py-4 rounded-md">
                <div
                  className="float-right text-2xl absolute top-2 right-1 mb-2 cursor-pointer"
                  onClick={() => setEditAddressPopUp(false)}
                >
                  <IoClose />
                </div>
                <h1 className="text-2xl ">Edit Address</h1>
                <div className="mt-4 px-3">
                  <form onSubmit={handleEditAddress}>
                    <div className="flex flex-col text-sm space-y-4">
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
                      <div className="flex w-full space-x-8  justify-between">
                        <div className="flex w-full flex-col  justify-start items-start">
                          <label>Name</label>
                          <input
                            name="fullName"
                            value={editFormData?.fullName}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border rounded px-2 mt-2 border-gray-400  flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>phone</label>
                          <input
                            name="phoneNumber"
                            value={editFormData?.phoneNumber}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border rounded px-2 mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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
                            className="w-full border rounded px-2 mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>City</label>
                          <input
                            name="city"
                            value={editFormData?.city}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border rounded px-2 mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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
                            className="w-full border rounded px-2 mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>Zip Code</label>
                          <input
                            name="pinCode"
                            value={editFormData?.pinCode}
                            type="text"
                            onChange={handleEditInputChange}
                            className="w-full border rounded px-2 mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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

                            className="w-full border rounded px-2 mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-start items-start">
                        <label>Address Type</label>
                        <select
                          name="addressType"
                          className="border rounded px-2 mt-2 border-gray-400 px-2 py-1 w-full focus:outline-none"
                          value={editFormData.addressType}
                          onChange={handleEditInputChange}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="home" className="text-black">
                            Home
                          </option>
                          <option value="work" className="text-black">
                            Work
                          </option>
                          <option value="office" className="text-black">
                            Office
                          </option>
                          <option value="other" className="text-black">
                            Other
                          </option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-c1  rounded-md cursor-pointer w-full mt-4 py-2 text-white"
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

              <div className="relative bg-white  text-c1 z-60 w-auto md:w-2xl px-2 py-4 rounded-md">
                <div
                  className="float-right text-2xl absolute top-2 right-1 mb-2 cursor-pointer"
                  onClick={() => setAddAddressPopUp(false)}
                >
                  <IoClose />
                </div>
                <h1 className="text-2xl ">Add Address</h1>
                <div className="mt-4 px-3">
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col text-sm space-y-4">
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
                            className="w-full border rounded mt-2 border-gray-400 px-2 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>phone</label>
                          <input
                            name="phoneNumber"
                            value={addAddressForm?.phoneNumber}
                            type="number"
                            onChange={handleInputChange}
                            className="w-full border rounded mt-2 px-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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
                            className="w-full border px-2 rounded mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>City</label>
                          <input
                            name="city"
                            value={addAddressForm?.city}
                            type="text"
                            onChange={handleInputChange}
                            className="w-full border px-2 rounded mt-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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
                            className="w-full border rounded mt-2 px-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>

                        <div className="flex flex-col w-full justify-start items-start">
                          <label>Pin Code</label>
                          <input
                            name="pinCode"
                            value={addAddressForm?.pinCode}
                            type="text"
                            onChange={handleInputChange}
                            className="w-full border rounded mt-2 px-2 border-gray-400 flex-1 py-2 placeholder-gray-300 outline-none "
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
                            className="w-full border rounded mt-2 border-gray-400 flex-1 px-2 py-2 placeholder-gray-300 outline-none "
                          />
                        </div>
                      </div>

                      <div className="flex flex-col justify-start items-start">
                        <label>Address Type</label>
                        <select
                          name="addressType"
                          className="border rounded mt-2 border-gray-400  px-2 py-1 w-full focus:outline-none"
                          value={addAddressForm.addressType}
                          onChange={handleInputChange}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="home" className="text-black">
                            Home
                          </option>
                          <option value="work" className="text-black">
                            Work
                          </option>
                          <option value="office" className="text-black">
                            Office
                          </option>
                          <option value="other" className="text-black">
                            Other
                          </option>
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
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-green-600"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Placed Successfully
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm leading-5 text-gray-500">
                      Order Placed Successfully we will reach out to soon
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <span className="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
                  <button
                    onClick={() => {
                      setSuccessPopUp(false);
                      navigate("/my-account/orders", { replace: true });
                    }}
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-green-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-green-500 focus:outline-none focus:shadow-outline-green transition ease-in-out duration-150 sm:text-sm sm:leading-5"
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
