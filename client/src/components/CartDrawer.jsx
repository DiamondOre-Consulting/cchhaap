import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";


const CartDrawer = ({ isOpen, onClose }) => {
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
          className={`fixed  overflow-x-hidden  top-0 right-0 h-screen w-[16rem] md:w-[30rem] z-40 overflow-y-auto  bg-white shadow-lg  transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex py-4 shadow-sm px-4 text-xl justify-between">
            <div className="flex items-center gap-x-2"><AiOutlineShoppingCart/>Cart</div>
            <button
              onClick={onClose}
              className="cursor-pointer"
            >
              ✕
            </button>
          </div>

        
        </div>
      </>
    </div>
  );
};

export default CartDrawer;
