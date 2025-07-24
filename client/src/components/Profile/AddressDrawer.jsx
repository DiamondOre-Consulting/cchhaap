import React from "react";
import { useForm } from "react-hook-form";
import { AiOutlineShoppingCart } from "react-icons/ai";

const AddressDrawer = ({ isOpen, onClose, formState }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
      isDefault: false,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${
          isOpen ? "opacity-20 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed  overflow-x-hidden  top-0 right-0 h-screen w-[16rem] md:w-[30rem] z-40 overflow-y-auto  bg-white shadow-lg  transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex py-4 shadow-sm px-4 text-xl justify-between">
          <div className="flex items-center gap-x-2">
            <AiOutlineShoppingCart />
            Address
          </div>
          <button onClick={onClose} className="cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          <p className="text-left text-[16px] mb-4">Please fill in the fields below:</p>
          <div className="grid grid-cols-2  gap-x-4 gap-y-3">
            {formState?.map((field, index) => {
              if (field?.inputType === "text") {
                return (
                  <div key={index} className="flex flex-col items-start">
                    <label className="text-[14px]">{field.label}</label>
                    <input
                      {...register(field.name, field.error)}
                      className="w-full border border-black/30 mt-1 px-3 py-4 rounded-md"
                      placeholder={`Enter your ${field.label}`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                );
              }

              if (field?.inputType === "textarea") {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start col-span-2"
                  >
                    <label className="text-[14px]">{field.label}</label>
                    <textarea
                      rows={6}
                      {...register(field.name, field.error)}
                      className="w-full border border-black/30 mt-1 px-3 py-4 rounded-md"
                      placeholder={`Enter your ${field.label}`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                );
              }

              if (field?.inputType === "select") {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start col-span-2"
                  >
                    <label className="text-[14px]">{field.label}</label>
                    <select
                      {...register(field.name, field.error)}
                      className="w-full border border-black/30 mt-1 px-3 py-4 rounded-md"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors[field.name] && (
                      <p className="text-red-500 text-sm">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                );
              }
              if (field?.inputType === "checkbox") {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 col-span-2"
                  >
                    <input
                      type="checkbox"
                      {...register(field.name)}
                      className="w-4 h-4 "
                    />
                    <label className="text-[14px]">{field.label}</label>
                  </div>
                );
              }

              return null;
            })}
          </div>
          <button className="bg-c1 w-full mt-4 py-3 text-white ">
              Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressDrawer;
