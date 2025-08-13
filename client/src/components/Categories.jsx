import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { categories } from "@/Redux/Slices/productsSlice";
import AOS from "aos";
import "aos/dist/aos.css";

const Categories = () => {
  const dispatch = useDispatch();
  const [allCategory, setAllCategory] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: false,
      easing: "ease-in-out",
      offset: 100,
    });

    AOS.refresh();
  }, [allCategory]);

  const allCategories = async () => {
    try {
      const response = await dispatch(categories());
      setAllCategory(response?.payload?.data || []);
    } catch (error) {
    }
  };

  useEffect(() => {
    allCategories();
  }, []);

  return (
    <div className="py-6 px-4">
      <div data-aos = "fade-up" className="text-center text-[2rem] md:text-[3rem] mb-8 uppercase">
        Our Categories
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allCategory.map((item, index) => (
          <Link
            data-aos="fade-up"
            data-aos-delay={(index % 4) * 100}
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
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-4 border w-fit py-2  shadow-md">
              <p className="text-sm  tracking-wider text-c1">
                {item.categoryName}
              </p>
            </div>
          </Link>
        ))}

        <Link
          to={`/all-products`}
          className="relative overflow-hidden  w-full max-w-sm mx-auto cursor-pointer group"
        >
          <div className="relative h-[500px] w-full overflow-hidden">
            <motion.img
              src="https://staticm247.kalkifashion.com/media/wysiwyg/Pitampura5.jpg"
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
