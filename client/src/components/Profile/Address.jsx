import React, { useEffect, useState } from "react";
import AddressDrawer from "./AddressDrawer";
import { MapPinPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { userDeleteAddress, userGetAllAddress } from "@/Redux/Slices/authSlice";
import { FaPhoneAlt } from "react-icons/fa";

const Address = () => {
  const [addressDrawer, setAddressDrawer] = useState(false);
  const [allAddress, setAllAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [ editAdd , setEditAdd] = useState()

  const dispatch = useDispatch();
  const handleDrawer = () => {
    setAddressDrawer((prev) => !prev);
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


   const handleDeleteAddress = async (addressId) => {
      try {
        const response = await dispatch(userDeleteAddress(addressId));
        await handleGetAllAddress();
      } catch (error) {
        console.log(error);
      }
    };
  

  useEffect(() => {
    handleGetAllAddress();
  }, []);

  const formState = [
    {
      label: "Full Name",
      name: "fullName",
      required: true,
      inputType: "text",
      error: {
        required: "Full Name is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },

    {
      label: "Phone Number",
      name: "phoneNumber",
      required: true,
      inputType: "text",
      error: {
        required: "Phone Number is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },
    {
      label: "Street",
      name: "street",
      required: true,
      inputType: "text",
      error: {
        required: "street is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },
    {
      label: "State",
      name: "state",
      required: true,
      inputType: "text",
      error: {
        required: "state is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },
    {
      label: "City",
      name: "city",
      required: true,
      inputType: "text",
      error: {
        required: " City is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },

    {
      label: "Pin Code",
      name: "pinCode",
      required: true,
      inputType: "text",
      error: {
        required: "Pin Code is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },

    {
      label: "Country",
      name: "country",
      required: true,
      inputType: "text",
      error: {
        required: "Country is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },

    
    {
      label: "Address Type",
      name: "addressType",
      required: true,
      inputType: "select",
      options:["home" , "work" , "office"],
      error: {
        required: "Address Type is required",
        minLength: { value: 2, message: "Minimum 2 characters required" },
      },
    },
    
    {
      label: "Set as Default",
      name: "isDefault",
      required: true,
      inputType: "checkbox",
    },
  ];

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center  mb-4">
        <h1 className="text-3xl  font-semibold">Address</h1>
        <div className="flex flex-wrap max-w-5xl   mt-6    flex-wrap">
            {allAddress?.addresses?.map((address, index) => (
          <div  key={index} className=" p-4 flex border border-white/40 justify-between items-center w-80">
              <div
               
                className={`mt-4 flex  flex-col gap-y-4 items-center  `}
              >
                <div className="flex flex-col gap-y-2">
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
                    onClick={() =>{ setEditAdd(address) ,setAddressDrawer(true)}}
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
          </div>
            ))}
          <div
            onClick={() => setAddressDrawer(true)}
            className="bg-[#edb141]/10 p-4 cursor-pointer flex flex-col space-y-4 text-white  justify-center border items-center w-80 h-40 "
          >
            <p>
              <MapPinPlus className="text-white " />
            </p>
            <p className="text-[16px] underline">+ Add New Address</p>
          </div>
        </div>
      </div>

      <AddressDrawer
        isOpen={addressDrawer}
        onClose={handleDrawer}
        formState={formState}
        handleGetAllAddress={handleGetAllAddress}
        editAdd={editAdd}
      />
    </div>
  );
};

export default Address;
