import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { categories } from "@/Redux/Slices/productsSlice";

const Categories = () => {
  const dispatch = useDispatch();
  const [allCategory, setAllCategory] = useState([]);

  const allCategories = async () => {
    try {
      const response = await dispatch(categories());
      console.log("data", response);
      setAllCategory(response?.payload?.data || []);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    allCategories();
  }, []);

  // console.log(allCategories)
  return (
    <div className="py-6 px-4">
      <h1 className="text-center text-[3rem] mb-8 uppercase">Our Categories</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allCategory.map((item, index) => (
          <Link
            to={`/products/${item?._id}/${encodeURIComponent(
              item.categoryName
            )}`}
            key={index}
            className="relative overflow-hidden  w-full max-w-sm mx-auto cursor-pointer group"
          >
            <div className="relative h-[500px] w-full overflow-hidden">
              <motion.img
                src={item.categoryImage.secureUrl}
                alt="Saree"
                className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-6 py-2  shadow-md">
              <p className="text-sm  tracking-wider text-c1">
                {item.categoryName}
              </p>
            </div>
          </Link>
        ))}

        <Link
          to={`/products`}         
          className="relative overflow-hidden  w-full max-w-sm mx-auto cursor-pointer group"
        >
          <div className="relative h-[500px] w-full overflow-hidden">
            <motion.img
              src="https://i.pinimg.com/736x/b8/fa/38/b8fa38115616cd6f72be0be883bedb37.jpg"
              alt="Saree"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-6 py-2  shadow-md">
            <p className="text-sm  tracking-wider text-c1">All Products</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Categories;
