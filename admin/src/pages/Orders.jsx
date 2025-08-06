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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAllOrders = async (page = 1, limit = itemsPerPage) => {
    try {
      setIsLoading(true);
      const response = await dispatch(
        adminFetchAllOrders({ 
          page, 
          limit, 
          orderType: orderStatusFilter,
          search: searchQuery 
        })
      );
      setAllOrders(response?.payload?.data?.orders || []);
      setTotalPages(response?.payload?.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1); 
    handleGetAllOrders(1, newLimit);
  };

  useEffect(() => {
    handleGetAllOrders(currentPage, itemsPerPage);
  }, [orderStatusFilter, currentPage, searchQuery]);

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
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleChangeStatus = async (orderId, newStatus) => {
    try {
      const response = await dispatch(
        adminChangeStatus({ orderId, orderStatus: newStatus })
      );
      if (response?.payload?.success) {
        handleGetAllOrders(currentPage, itemsPerPage);
      }
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleGetSingleOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxVisiblePages - 1, totalPages);
      
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
      
      if (start > 1) {
        visiblePages.push(1);
        if (start > 2) {
          visiblePages.push('...');
        }
      }
      
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= totalPages) {
          visiblePages.push(i);
        }
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) {
          visiblePages.push('...');
        }
        visiblePages.push(totalPages);
      }
    }
    
    return visiblePages;
  };

  return (
    <HomeLayout>
      <div className=" mx-auto  py-2">
        <div className="mb-6">
          <h1 className="text-2xl  text-gray-800">Manage Orders</h1>
          <div className="w-40 h-[2px] bg-c1 rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center p-4 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <div>
                <select
                  value={orderStatusFilter}
                  onChange={handleStatusFilterChange}
                  className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
              <div>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
            </div>
            
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search orders..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allOrders.length > 0 ? (
                      allOrders.map((order) => (
                        <tr 
                          key={order._id} 
                          className={`hover:bg-gray-50 ${
                            order.orderStatus === "delivered" ? "bg-green-50" : 
                            order.orderStatus === "cancelled" ? "bg-red-50" : ""
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.paymentMethod.toUpperCase()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.paymentStatus === "paid" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleChangeStatus(order._id, e.target.value)}
                              className={`block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                                order.orderStatus === "delivered" ? "bg-green-100" :
                                order.orderStatus === "cancelled" ? "bg-red-100" : "bg-yellow-100"
                              }`}
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
                          <td className="px-6   py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleGetSingleOrder(order)}
                              className="text-blue-600 cursor-pointer hover:text-blue-900"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, allOrders.length)}</span> of{' '}
                        <span className="font-medium">{allOrders.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {getVisiblePages().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        ))}
                        
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

       
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end  bg-black/40 justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 cursor-pointer   opacity-75" onClick={() => setShowOrderDetails(false)}></div>
              </div>
              
              <span className="hidden sm:inline-block cursor-pointer sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
              
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex  sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Order Details - #{selectedOrder._id.substring(18, 24).toUpperCase()}
                        </h3>
                        <button
                          onClick={() => setShowOrderDetails(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3">Order Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Order Date:</span>
                              <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total Amount:</span>
                              <span className="text-gray-900 font-medium">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Payment Method:</span>
                              <span className="text-gray-900">{selectedOrder.paymentMethod.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Payment Status:</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                selectedOrder.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {selectedOrder.paymentStatus.toUpperCase()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Order Status:</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                selectedOrder.orderStatus === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : selectedOrder.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {selectedOrder.orderStatus.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          
                          <h4 className="text-md font-semibold text-gray-900 mt-6 mb-3">Shipping Address</h4>
                          <div className="text-sm space-y-1">
                            <p className="text-gray-900 font-medium">{selectedOrder.shippingAddress.fullName}</p>
                            <p className="text-gray-700">{selectedOrder.shippingAddress.street}</p>
                            <p className="text-gray-700">
                              {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.pinCode}
                            </p>
                            <p className="text-gray-700">{selectedOrder.shippingAddress.country}</p>
                            <p className="text-gray-700">Phone: {selectedOrder.shippingAddress.phoneNumber}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 mb-3">Products ({selectedOrder.products.length})</h4>
                          <div className="space-y-4">
                            {selectedOrder.products.map((product, index) => (
                              <div key={index} className="flex border-b pb-4 last:border-b-0">
                                <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                                  <img
                                    src={product.thumbnail}
                                    alt={product.productName}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{product.productName}</h3>
                                    <p>₹{product.price.toLocaleString()}</p>
                                  </div>
                                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                                    <p>Size: {product.size}</p>
                                    <p>Qty: {product.quantity}</p>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <span 
                                      className="inline-block h-4 w-4 rounded-full mr-2 border border-gray-300"
                                      style={{ backgroundColor: product.color.hex }}
                                      title={product.color.name}
                                    ></span>
                                    <span className="text-sm text-gray-500">{product.color.name}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setShowOrderDetails(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-00 text-base font-medium text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default Orders;