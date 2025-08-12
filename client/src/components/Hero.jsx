import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetAllBannerImages } from "../Redux/Slices/authSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);

  const handleGetAllImage = async () => {
    try {
      const res = await dispatch(GetAllBannerImages());
      setImages(res?.payload?.data[0]?.bannerImage || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllImage();
  }, []);

  return (
    <div className="relative h-[60vh] md:h-screen">
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        effect="fade"
        loop={true}
        className="w-full h-full"
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={slide.secureUrl}
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Centered Button */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Link
            to="/all-products"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden font-medium"
          >
            <div className="inline-flex border border-neutral-200 h-12 translate-x-0 items-center justify-center uppercase px-6 text-neutral-100 transition group-hover:-translate-x-[150%]">
              Explore Products
            </div>
            <div className="absolute border border-[#6d0c04] inline-flex h-12 w-full translate-x-[100%] items-center justify-center bg-[#6d0c04]/60 px-6 text-neutral-50 transition duration-300 group-hover:translate-x-0">
              Explore Products
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;