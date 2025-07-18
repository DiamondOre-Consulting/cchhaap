import React from 'react'
import { motion } from "framer-motion";


const ShopFor = () => {

      const items = [
    {
      image:
        "https://images.pexels.com/photos/878358/pexels-photo-878358.jpeg",
      category: "Men",
    },
    {
      image:
        "https://images.pexels.com/photos/1631181/pexels-photo-1631181.jpeg",
      category: "Women",
    },
    {
      image:
        "https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg",
      category: "Kids",
    },

    
  ];

  return (
    <div>
       <div className="py-6 px-4">
      <h1 className="text-center  text-[3rem]  mb-8 uppercase">Shop For</h1>

      <div className="grid grid-cols-3 gap-x-4 ">
        {items.map((item , index) => (
          <div key={index} className="relative overflow-hidden  w-full max-w-lg mx-auto cursor-pointer group">
            <div className="relative h-[500px] w-full overflow-hidden">
              <motion.img
                src={item.image}
                alt="Saree"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-6 py-2  shadow-md">
              <p className="text-md  tracking-wider text-black">
                {item.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default ShopFor
