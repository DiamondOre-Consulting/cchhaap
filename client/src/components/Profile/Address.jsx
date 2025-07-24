import React, { useState } from "react";
import AddressDrawer from "./AddressDrawer";
import { MapPinPlus } from "lucide-react";
import { useForm } from "react-hook-form";


const Address = () => {
  const [addressDrawer, setAddressDrawer] = useState(false);

  const handleDrawer = () => {
    setAddressDrawer((prev) => !prev);
  };

  const {
    register, 
    control,
    handleSubmit,
    watch,
    setValue,
    reset
  }= useForm({
    defaultValues:{
        
    }
  })


  return (
    <div className="">
      <div className="flex flex-col items-center justify-center  mb-4">
        <h1 className="text-3xl  font-semibold">Address</h1>
        <div className="flex max-w-5xl  h-40 mt-6 gap-y-6  gap-x-4 flex-wrap">
          <div className="border p-4 flex justify-between items-center w-80">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati
            perferendis non minima exercitationem cupiditate a amet aperiam
            aliquid eum. Minus, autem explicabo modi temporibus magni dolore
            accusantium itaque dolorum consequuntur?{" "}
          </div>
          <div onClick={()=> setAddressDrawer(true)} className="bg-c1 p-4 cursor-pointer flex flex-col space-y-4 text-white  justify-center items-center w-80">
            <p>
              <MapPinPlus className="text-white " />
            </p>
            <p className="text-[16px] underline">+ Add New Address</p>
          </div>
        </div>
      </div>

      <AddressDrawer isOpen={addressDrawer} onClose={handleDrawer} />
    </div>
  );
};

export default Address;
