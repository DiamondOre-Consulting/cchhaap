import {
  ExchangeOrder,
  userGetAllOrders,
  userGetSingleOrder,
} from "@/Redux/Slices/order.Slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown, X } from "lucide-react";


const ExchangeRequestCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800">Exchange Request Submitted</h3>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Processing
        </span>
      </div>

      <div className="flex items-start mb-4">
        <img
          src={product.thumbnail}
          alt={product.productName}
          className="w-16 h-16 object-contain rounded border border-gray-200 mr-3"
        />
        <div>
          <h4 className="text-sm font-medium text-gray-800">{product.productName}</h4>
          <p className="text-sm text-gray-600">
            Size: <span className="font-medium">{product.selectedVariation.size}</span>
          </p>
          <p className="text-sm text-gray-600">
            Color: <span className="font-medium">{product.selectedVariation.color.name}</span>
          </p>
        </div>
      </div>

      <div className="bg-c1 backdrop-blur border-l-4 border-[#edb141] p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-c2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-c2">Next Steps</h3>
            <div className="mt-2 text-sm text-c2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Repack the item with original packaging and the original brand tags</li>
                <li>Hand over the package to the delivery agent and collect the new package</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>Our delivery partner will contact you within 24 hours to schedule pickup.</p>
      </div>
    </div>
  );
};


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [exchangeType, setExchangeType] = useState("size");
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const dispatch = useDispatch();

  const exchangeCloseDate = new Date("2025-08-12");

  const handleGetAllOrders = async () => {
    try {
      setLoading(true);
      const response = await dispatch(userGetAllOrders());
      console.log("allorders", response);
      if (response?.payload?.success) {
        setOrders(response.payload.data.orders || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (id) => {
    try {
      const response = await dispatch(userGetSingleOrder(id));
      if (response?.payload?.success) {
        setSelectedOrder(response.payload.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setExchangeOpen(false);
    setSelectedProduct(null);
  };
  useEffect(() => {
    handleGetAllOrders();
  }, []);
  const toggleExchange = (product) => {
    setSelectedProduct(product);
    setExchangeOpen(!exchangeOpen);

    if (!exchangeOpen) {
      setSelectedSize(null);
      setSelectedColor(null);
    }
  };

  const handleExchangeTypeChange = (type) => {
    setExchangeType(type);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const isExchangeWindowClosed = new Date() > exchangeCloseDate;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-c2"></div>
      </div>
    );
  }
  console.log("selected order", selectedOrder);

  const handleExchangeSubmit = async (product) => {
    try {
      let selectedVariation;

      if (exchangeType === "size") {
        selectedVariation = product.allVariations.find(
          (v) =>
            v.size === selectedSize &&
            v.color.name === product.selectedVariation.color.name
        );
      } else {
        selectedVariation = product.allVariations.find(
          (v) =>
            v.color.name === selectedColor?.name &&
            v.size === product.selectedVariation.size
        );
      }

      if (!selectedVariation) {
        console.error("No matching variation found");
        return;
      }

      const response = await dispatch(
        ExchangeOrder({
          orderId: selectedOrder._id,
          variationId: selectedVariation._id,
          oldVariationId: product.selectedVariation._id,
        })
      );

      if (response?.payload?.success) {
        closeModal();
        // Optionally show success notification
      }
    } catch (error) {
      console.error("Exchange error:", error);
      // Optionally show error notification
    }
  };

  const isExchangeAvailable = (order) => {
    if (order.orderStatus !== "delivered") return false;

    const deliveryDate = new Date(order.deliveryDate);
    const today = new Date();
    const exchangeEndDate = new Date(deliveryDate);
    exchangeEndDate.setDate(deliveryDate.getDate() + 7); // Add 7 days to delivery date

    return today <= exchangeEndDate;
  };

  return (
    <div className="p-4 md:p-6 w-full mx-auto min-h-screen">
      <div className="flex items-center justify-center relative w-fit mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
          Your Orders
        </h1>
        <div className="bg-c2 text-c1 w-6 h-6 text-sm flex items-center justify-center rounded-full absolute -top-2 -right-5">
          {orders.length}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center rounded-lg shadow-sm mx-auto">
          <div className="max-w-md mx-auto p-6">
            <svg
              className="w-18 h-18 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-100">
              No orders yet
            </h3>
            <p className="mt-2 text-gray-200">
              You haven't placed any orders. Start shopping to see your orders
              here.
            </p>
            <div className="mt-6">
              <Link
                to="/all-products"
                className="inline-flex items-center text-c1 px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium  bg-c2 hover:bg-c2/90 transition-colors duration-200"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white w-80 relative border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-500">ORDER PLACED</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">
                      {new Date(order.createdAt)?.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">TOTAL</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      {order.totalAmount?.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 mb-10">
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order?.status?.charAt(0)?.toUpperCase() +
                      order?.status?.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {order.products.length} item
                    {order.products.length > 1 ? "s" : ""}
                  </span>
                </div>

                {order.products.slice(0, 2).map((product, index) => (
                  <div
                    key={index}
                    className="flex border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={product.thumbnail}
                        alt={product.productName}
                        className="w-16 h-16 object-contain rounded border border-gray-200"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {product.productName}
                      </h3>
                      <div className="mt-1 text-xs text-gray-500">
                        <span>Qty: {product.quantity}</span>
                      </div>
                      <div className="mt-1 text-sm text-c1 font-semibold">
                        {product.price?.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {order.products.length > 2 && (
                  <div className="text-sm text-gray-500">
                    +{order.products.length - 2} more items
                  </div>
                )}
              </div>

              <div className="bg-gray-50 absolute bottom-0 w-full px-4 py-3 flex justify-end">
                <button
                  onClick={() => handleViewOrder(order._id)}
                  className="text-sm font-medium cursor-pointer text-c1 hover:underline"
                >
                  View Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex bg-white justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Order Details
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 cursor-pointer hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div>
                      <p className="text-gray-500 text-sm">
                        Order #: {selectedOrder._id}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          selectedOrder.orderStatus === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : selectedOrder.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedOrder?.orderStatus?.charAt(0)?.toUpperCase() +
                          selectedOrder?.orderStatus?.slice(1)}
                      </span>
                      <p className="text-gray-500 mt-1 text-sm">
                        Ordered on{" "}
                        {new Date(selectedOrder.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Products
                    </h4>
                    {selectedOrder.products.map((product, index) => {
                      const isDelivered =
                        selectedOrder.orderStatus === "delivered";

                      const canExchange = isExchangeAvailable(selectedOrder);

                      return (
                        <div
                          key={index}
                          className="flex flex-col  border-b border-gray-100 pb-6 mb-6"
                        >

                          <div className="flex ">
                          <div className="flex-shrink-0">
                            <img
                              src={product.thumbnail}
                              alt={product.productName}
                              className="w-28 h-28 object-contain rounded-lg border border-gray-200"
                            />
                          </div>
                          <div className="mt-4  sm:mt-0 sm:ml-6 flex-1">
                            <h3 className="text-sm font-medium text-gray-800">
                              {product.productName}
                            </h3>
                            <div className="mt-1">
                              <span className="text-lg font-semibold text-gray-900">
                                {product.price?.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                  maximumFractionDigits: 0,
                                })}
                              </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-1">Qty:</span>
                                <span className="font-medium">
                                  {product.quantity}
                                </span>
                              </div>

                            
                            </div>

                            {canExchange  && !product.exchangeApplied && (
                              <div
                                className="text-c1 flex items-center justify-between bg-gray-50 p-2 w-full mt-2 cursor-pointer"
                                onClick={() => toggleExchange(product)}
                              >
                                <span>Exchange Available</span>
                                {exchangeOpen &&
                                selectedProduct?._id === product._id ? (
                                  <ChevronDown />
                                ) : (
                                  <ChevronUp />
                                )}
                              </div>
                            )}

                            {exchangeOpen &&
                              selectedProduct?._id === product._id &&
                              canExchange && (
                                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                  <div className="flex space-x-4 mb-4">
                                    <button
                                      onClick={() =>
                                        handleExchangeTypeChange("size")
                                      }
                                      className={`px-4 py-2 rounded-md ${
                                        exchangeType === "size"
                                          ? "bg-c1 text-white"
                                          : "bg-gray-200 text-gray-800"
                                      }`}
                                    >
                                      Exchange Size
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleExchangeTypeChange("color")
                                      }
                                      className={`px-4 py-2 rounded-md ${
                                        exchangeType === "color"
                                          ? "bg-c1 text-white"
                                          : "bg-gray-200 text-gray-800"
                                      }`}
                                    >
                                      Exchange Color
                                    </button>
                                  </div>

                                  {exchangeType === "size" && (
                                    <div>
                                      <h4 className="font-medium text-gray-700 mb-2">
                                        Select Size
                                      </h4>
                                      <div className="flex flex-wrap text-gray-700 cursor-pointer gap-2">
                                        {product.allVariations
                                          .filter(
                                            (variation) =>
                                              variation.color.name ===
                                                product.selectedVariation.color
                                                  .name &&
                                              variation.size !==
                                                product.selectedVariation
                                                  .size &&
                                              variation.discountPrice ===
                                                product.selectedVariation
                                                  .discountPrice
                                          )
                                          .map((variation) => (
                                            <button
                                              key={variation.size}
                                              onClick={() =>
                                                handleSizeSelect(variation.size)
                                              }
                                              className={`px-3 py-1 border rounded-md ${
                                                selectedSize === variation.size
                                                  ? "border-c1 bg-c1/10 text-c1"
                                                  : "border-gray-300"
                                              }`}
                                            >
                                              {variation.size}
                                            </button>
                                          ))}
                                      </div>
                                    </div>
                                  )}

                                  {exchangeType === "color" && (
                                    <div>
                                      <h4 className="font-medium mb-2">
                                        Select Color
                                      </h4>
                                      <div className="flex flex-wrap gap-3">
                                        {product.allVariations
                                          .filter(
                                            (variation) =>
                                              variation.size ===
                                                product.selectedVariation
                                                  .size &&
                                              variation.color.name !==
                                                product.selectedVariation.color
                                                  .name &&
                                              variation.discountPrice ===
                                                product.selectedVariation
                                                  .discountPrice
                                          )
                                          .reduce((uniqueColors, variation) => {
                                            if (
                                              !uniqueColors.some(
                                                (color) =>
                                                  color.name ===
                                                  variation.color.name
                                              )
                                            ) {
                                              uniqueColors.push(
                                                variation.color
                                              );
                                            }
                                            return uniqueColors;
                                          }, [])
                                          .map((color) => (
                                            <button
                                              key={color.name}
                                              onClick={() =>
                                                handleColorSelect(color)
                                              }
                                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                                                selectedColor?.name ===
                                                color.name
                                                  ? "border-c1"
                                                  : "border-gray-300"
                                              }`}
                                              style={{
                                                backgroundColor: color.hex,
                                              }}
                                              title={color.name}
                                            ></button>
                                          ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* {(selectedSize || selectedColor) && (
                                    <div className="mt-4 p-3 bg-gray-100 rounded-md">
                                      <p className="text-sm text-gray-700">
                                        Shipping charges: ₹177 will be added for
                                        this exchange
                                      </p>
                                    </div>
                                  )} */}

                                  <button
                                    onClick={() =>
                                      handleExchangeSubmit(product)
                                    }
                                    disabled={
                                      (exchangeType === "size" &&
                                        !selectedSize) ||
                                      (exchangeType === "color" &&
                                        !selectedColor)
                                    }
                                    className={`... bg-c1 p-2 mt-2  text-white`}
                                  >
                                    Request Exchange
                                  </button>
                                </div>
                              )}
                          </div>
                          </div>

                            {product.exchangeApplied && (
        <div className="mt-4 w-full">
          <ExchangeRequestCard product={product} />
        </div>
      )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Shipping Address
                      </h3>
                      <div className="text-gray-800">
                        <p>{selectedOrder.shippingAddress.fullName}</p>
                        <p>
                          {selectedOrder.shippingAddress.street},{" "}
                          {selectedOrder.shippingAddress.city},{" "}
                          {selectedOrder.shippingAddress.state} -{" "}
                          {selectedOrder.shippingAddress.pinCode}
                        </p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                        <p className="mt-2">
                          Phone: {selectedOrder.shippingAddress.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Payment Information
                      </h3>
                      <div className="text-gray-600">
                        <p>
                          <span className="font-medium">Method:</span>{" "}
                          {selectedOrder?.paymentMethod
                            ?.charAt(0)
                            ?.toUpperCase() +
                            selectedOrder?.paymentMethod?.slice(1)}
                        </p>
                        <p className="mt-2">
                          <span className="font-medium">Total:</span>{" "}
                          {selectedOrder.totalAmount?.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
