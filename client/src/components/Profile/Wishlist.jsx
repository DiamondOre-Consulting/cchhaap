import React, { useState } from "react";
import { X } from "lucide-react";

const Wishlist = () => {
  const [qty, setQty] = useState(1);

  
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold">My Wishlist</h1>
      <div className="grid grid-cols-4 gap-6 mt-10 ">
        <div className="max-w-[20rem] relative  h-full">
          <img
            src="https://shopmulmul.com/cdn/shop/files/236_58b58618-38be-4641-befd-392be0c234ff_800x.jpg?v=1751977535"
            alt=""
            className="h-[23rem] w-full  object-cover"
          />
          <div className=" border border-black/20 border-t-0">
            <div className="px-2">
              <p className="text-md text-black text-left py-2 line-clamp-1">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum,
                fuga!
              </p>
              <div className="flex text-black items-center py-4 justify-between">
                <p className="text-lg">₹11,23245</p>
                <div className="flex items-center w-full border mt-1 border-black/30 px-4  max-w-[150px] justify-between text-black/50">
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
              </div>
            </div>

            <button className="bg-black/10 w-full py-2 text-black">
              Add To Cart
            </button>
          </div>
          <p className="absolute top-2 right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition">
            <X size={14} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
