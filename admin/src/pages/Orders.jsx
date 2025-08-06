import React, { useEffect, useState } from "react";
import HomeLayout from "../Layout/HomeLayout";
import { useDispatch } from "react-redux";
import {
  adminChangeStatus,
  adminFetchAllOrders,
} from "@/Redux/Slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const [allOrders, setAllOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const page = 1;
  const limit = 10;

  const handleGetAllOrders = async () => {
    try {
      const response = await dispatch(
        adminFetchAllOrders({ page, limit, orderType: orderStatusFilter })
      );
      console.log(response);
      setAllOrders(response?.payload?.data?.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllOrders();
  }, [orderStatusFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusFilterChange = (e) => {
    setOrderStatusFilter(e.target.value);
  };



  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      const response = await dispatch(
        adminChangeStatus({ orderId, orderStatus: newStatus })
      );
      if (response?.payload?.success) {
        handleGetAllOrders()
        setAllOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, orderStatus: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  return (
    <HomeLayout>
      <div>
        <div>
          <div className="flex justify-between ">
            <div>
              <h1 className="text-2xl">Manage Orders</h1>
              <div className="w-40 h-[2px] bg-c1"></div>
            </div>
          </div>
        </div>

        <div className="relative mt-10 overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex bg-white p-3 flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div>
              <select
                value={orderStatusFilter}
                onChange={handleStatusFilterChange}
                className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5"
              >
                <option value="">All Orders</option>
                {["pending", "shipped", "delivered", "cancelled"].map(
                  (status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  )
                )}
              </select>
            </div>
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for items"
              />
            </div>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order Date & Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Method
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allOrders?.map((order) => (
                <tr
                  key={order._id}
                  className={` border-b ${
                    order?.orderStatus == "delivered"
                      ? "bg-green-100"
                      : "bg-white"
                  }   dark:border-gray-700 border-gray-200  dark:hover:bg-gray-600`}
                >
                  <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">{order.user.email}</td>
                  <td className="px-6 py-4">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        order.paymentStatus === "paid"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="border w-full py-1 rounded"
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleChangeStatus(order._id, e.target.value)
                      }
                    >
                      {["pending", "shipped", "delivered", "cancelled"].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className="cursor-pointer"
                      onClick={() => handleGetSingleOrder(order?.id)}
                    >
                      View
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Orders;
