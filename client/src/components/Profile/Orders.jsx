import { userGetAllOrders } from "@/Redux/Slices/order.Slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Orders = () => {
  
  const [allOrders , setAllOrders] = useState(0);
  const dispatch = useDispatch();

  const handleGetAllOrders = async() =>{
    try {
      const response = await dispatch(userGetAllOrders());
      console.log("allorders",response)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    handleGetAllOrders()
  },[])
  const order = [];
  return (
    <div>
      {order.length === 0 ? (
        <>
          <div className="p-6">
            <div className="flex items-center justify-center relative w-fit   mx-auto mb-4">
              <h1 className="text-3xl font-semibold">Orders</h1>
              <div className="bg-c2 text-white w-6 h-6 text-sm flex items-center  justify-center rounded-full absolute -top-2  -right-5">
                0
              </div>
            </div>

            <p className="text-gray-300 mx-auto  mb-6">
              You have not placed any orders yet.
            </p>

            <Link to={'/all-products'} className="bg-c2 text-c1 text-lg font-bold tracking-wider px-10 py-4 rounded transition">
              Start Shopping
            </Link>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Orders;
