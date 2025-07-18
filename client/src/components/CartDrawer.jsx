import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";

const CartDrawer = ({ isOpen, onClose }) => {
    const [qty, setQty] = useState(1);
  
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
            <div className="flex items-center gap-x-2">
              <AiOutlineShoppingCart />
              Cart
            </div>
            <button onClick={onClose} className="cursor-pointer">
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-y-6 py-6">
            <div className="flex  border-black px-8 gap-x-4 items-center">
              <img
                src="https://shopmulmul.com/cdn/shop/files/2_dd55b873-fc4f-4601-ae43-f44a0b851462.jpg?v=1752212130&width=700"
                className="max-h-32 object-cover "
                alt=""
              />
              <div className="flex  w-full justify-between">
                <div className="flex flex-col">
                  <p className="text-sm">Elusha Lime Organza Kura Set</p>
                  <p>XS || XS</p>

                  <div className="flex items-end w-full gap-x-4 mt-2">
                   <div className="flex items-center w-full border mt-1 border-black/30 px-4  max-w-[200px] justify-between text-black/50">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(qty - 1, 0))}
                        className="text-2xl font-bold px-2 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-lg">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="text-2xl font-bold px-2 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <p className="underline text-xs text-black/60">Remove</p>
                    </div>
                </div>

                <div>₹ 100,00</div>
              </div>
            </div>



               <div className="flex  border-black px-8 gap-x-4 items-center">
              <img
                src="https://shopmulmul.com/cdn/shop/files/2_dd55b873-fc4f-4601-ae43-f44a0b851462.jpg?v=1752212130&width=700"
                className="max-h-32 object-cover "
                alt=""
              />
              <div className="flex  w-full justify-between">
                <div className="flex flex-col">
                  <p className="text-sm">Elusha Lime Organza Kura Set</p>
                  <p>XS || XS</p>

                  <div className="flex items-end w-full gap-x-4 mt-2">
                   <div className="flex items-center w-full border mt-1 border-black/30 px-4  max-w-[200px] justify-between text-black/50">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(qty - 1, 0))}
                        className="text-2xl font-bold px-2 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-lg">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="text-2xl font-bold px-2 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <p className="underline text-xs text-black/60">Remove</p>
                    </div>
                </div>

                <div>₹ 100,00</div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default CartDrawer;
