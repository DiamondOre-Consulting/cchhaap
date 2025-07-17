import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

const SearchDrawer = ({ isOpen, onClose }) => {
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
          <div className="flex py-4 shadow-sm px-4 text-xl w-full justify-between">
            <div className="flex items-center gap-x-2">
              <CiSearch />
              <input
                type="text"
                placeholder="What are you looking for ? "
                className="w-[20rem] focus:outline-none"
              />
            </div>
            <button onClick={onClose} className="cursor-pointer">
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-y-6 py-6">
            <div className="flex border-black px-8 gap-x-4 items-center">
              <img
                src="https://shopmulmul.com/cdn/shop/files/2_dd55b873-fc4f-4601-ae43-f44a0b851462.jpg?v=1752212130&width=700"
                className="max-h-32 object-cover "
                alt=""
              />
              <div>
                <p className="text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. A laboriosam expedita rerum minus suscipit!</p>
                <p>$ 100,00</p>
              </div>
            </div>

              <div className="flex border-black px-8 gap-x-4 items-center">
              <img
                src="https://shopmulmul.com/cdn/shop/files/2_dd55b873-fc4f-4601-ae43-f44a0b851462.jpg?v=1752212130&width=700"
                className="max-h-32 object-cover "
                alt=""
              />
              <div>
                <p className="text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. A laboriosam expedita rerum minus suscipit!</p>
                <p>$ 100,00</p>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default SearchDrawer;
