import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  getNavbarCartWishlistCount,
  userGetCart,
  userRomoveProductFromCart,
  userUpdateCart,
} from "@/Redux/Slices/cart";

const CartDrawer = ({ isOpen, onClose }) => {
  const [qty, setQty] = useState(0);
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState([]);
  const [customLoader, setCustomLoader] = useState(true);
  const navigate = useNavigate();
  const { user, isLoggedin } = useSelector((state) => state?.user);
  console.log(user);

  const handleGetCart = async () => {
    try {
      setCustomLoader(true);
      const response = await dispatch(userGetCart());
      // setCartData(response)
      console.log(response)
      setCartData(response?.payload?.data || []);
      console.log("getting cart data", response);
      
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setCustomLoader(false);
    }
  };
  useEffect(() => {
    if (isOpen) {
      handleGetCart();
    }
  }, [isOpen]);

  const handleDeleteProductFromCart = async (productId) => {
    try {
     const response =  await dispatch(userRomoveProductFromCart(productId));
      handleGetCart();
      dispatch(getNavbarCartWishlistCount())
      console.log("my",response)
      if(response?.payload?.data === null){
        onClose()
      }
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  const updateCart = async (newQuantity, productId , variationId) => {
    console.log(variationId);
    // if (newQuantity < 1) return;
    try {
      await dispatch(
        userUpdateCart({ quantity: newQuantity, productId, variationId })
      );
      handleGetCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  console.log("cart data thihs ", cartData);
  return (
    <div>
      <>
        <div
          className={`fixed inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${
            isOpen ? "opacity-20 visible" : "opacity-0 invisible"
          }`}
          onClick={onClose}
        ></div>

        <div
          className={`fixed  overflow-x-hidden  top-0 right-0 h-screen w-full md:w-[30rem] z-40 overflow-y-auto  bg-white shadow-lg  transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex py-4 fixed w-full top-0 shadow-sm px-4 bg-white text-black text-xl justify-between">
            <div className="flex items-center gap-x-2">
              <AiOutlineShoppingCart />
              Cart
            </div>
            <button onClick={onClose} className="cursor-pointer">
              ✕
            </button>
          </div>

          <div className="flex flex-col bg-white gap-y-6 py-6 text-black pt-20 h-full">
            {cartData?.products?.map((item) => {
              // Find the exact variation that matches the variationId in the cart
              const variation =
                item.productId?.variations?.find(
                  (v) => v?._id === item?.variationId
                ) || item?.productId?.variations[0];
              return (
                <div
                  key={item?._id}
                  className="flex border-black px-8 gap-x-4 items-center"
                >

                     <Link to={`/each-product/${item?.productId?._id}`} onClick={onClose} className="h-32 w-40 overflow-hidden">
                    <img
                     src={
                      variation?.thumbnailImage?.secureUrl ||
                      "https://via.placeholder.com/150"
                    }
                      className="h-full w-full object-cover"
                      alt={item?.productId?.productName}
                    />
                  </Link>
                 
                  <div className="flex w-full justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {item?.productId?.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {variation?.color?.name || "Color not specified"} |{" "}
                        {variation?.size || "Size not specified"}
                      </p>

                      <div className="flex items-end w-full gap-x-4 mt-2">
                        <div className="flex items-center w-full border mt-1 border-black/30 px-4 max-w-[200px] justify-between text-black/50">
                          <button
                            type="button"
                            onClick={() => {
                              // setVariationId(item.variationId);
                              updateCart(
                                item.quantity - 1,
                                item.productId._id,
                                item.variationId
                              );
                            }}
                            className="text-2xl font-bold px-2 cursor-pointer hover:text-black"
                          >
                            -
                          </button>
                          <span className="text-lg">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => {
                              // setVariationId(item.variationId);
                              updateCart(
                                item.quantity + 1,
                                item.productId._id,
                                item.variationId
                              );
                            }}
                            className="text-2xl font-bold px-2 cursor-pointer hover:text-black"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            handleDeleteProductFromCart(item?.productId?._id)
                          }
                          className="underline text-xs cursor-pointer text-black/60 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        ₹
                        {(variation?.discountPrice * item.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </p>
                      {variation?.discountPrice > 0 && (
                        <p className="text-sm line-through text-gray-500">
                          ₹
                          {(
                            variation.price
                          ).toLocaleString("en-IN")}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {item.quantity} × ₹
                        {variation?.discountPrice?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {cartData?.products?.length > 0 ? (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 mt-auto">
                <div className="flex justify-between text-lg font-medium mb-4">
                  <span>Subtotal:</span>
                  <span>
                    ₹
                    {cartData.products
                      .reduce((total, item) => {
                        const variation = item?.productId?.variations?.find(
                          (v) => v._id === item.variationId
                        );
                        return (
                          total +
                          (variation?.discountPrice || item.price || 0) * item.quantity
                        );
                      }, 0)
                      .toLocaleString("en-IN")}
                  </span>
                </div>
                <button
                  onClick={() => {
                    navigate("/checkout");
                    onClose();
                  }}
                  className="w-full bg-c1 text-white py-3 cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout (
                  {cartData.products.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}{" "}
                  items)
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg mb-4">Your cart is empty</p>
                <Link
                 to={'/all-products'}
                 onClick={onClose}
                  className="bg-c1 text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

export default CartDrawer;
