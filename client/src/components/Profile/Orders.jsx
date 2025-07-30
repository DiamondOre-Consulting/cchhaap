import React from "react";

const Orders = () => {
  const order = [];
  return (
    <div>
      {order.length === 0 ? (
        <>
          <div className="p-6">
            <div className="flex items-center justify-center relative mb-4">
              <h1 className="text-3xl font-semibold">Orders</h1>
              <div className="bg-c1 text-white w-6 h-6 text-sm flex items-center  justify-center rounded-full absolute -top-2  right-4">
                0
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              You have not placed any orders yet.
            </p>

            <button className="bg-c2 text-c1 text-lg font-bold tracking-wider px-10 py-4 rounded transition">
              Start Shopping
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Orders;
