import React from "react";
import { motion } from "framer-motion";

const Categories = () => {
  const items = [
    {
      image:
        "https://shopmulmul.com/cdn/shop/files/2_dd55b873-fc4f-4601-ae43-f44a0b851462.jpg?v=1752212130&width=700",
      category: "SAREES",
    },
    {
      image:
        "https://shopmulmul.com/cdn/shop/files/7_4540b3fb-5642-401c-ae86-1c270619f7c7.jpg?v=1752212130&width=700",
      category: "Shirts",
    },
    {
      image:
        "https://shopmulmul.com/cdn/shop/files/2_dd55b873-fc4f-4601-ae43-f44a0b851462.jpg?v=1752212130&width=700",
      category: "SAREES",
    },

    {
      image:
        "https://shopmulmul.com/cdn/shop/files/4_0cbcf5a3-232a-416b-ae53-e74d42b307d1.jpg?v=1752212130&width=700",
      category: "SAREES",
    },
  ];
  return (
    <div className="py-6 px-4">
      <h1 className="text-center  text-[3rem]  mb-8  uppercase"> Our Categories</h1>

      <div className="grid grid-cols-4 gap-x-4 ">
        {items.map((item , index) => (
          <div key={index} className="relative overflow-hidden  w-full max-w-sm mx-auto cursor-pointer group">
            <div className="relative h-[500px] w-full overflow-hidden">
              <motion.img
                src={item.image}
                alt="Saree"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-6 py-2  shadow-md">
              <p className="text-sm  tracking-wider text-black">
                {item.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
