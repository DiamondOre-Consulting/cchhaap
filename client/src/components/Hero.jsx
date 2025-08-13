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
  const [loading, setLoading] = useState(true);

  const handleGetAllImage = async () => {
    try {
      setLoading(true);
      const res = await dispatch(GetAllBannerImages());
      setImages(res?.payload?.data[0]?.bannerImage || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetAllImage();
  }, []);

  if (loading) {
    return (
      <div className="relative h-[60vh] md:h-screen flex items-center justify-center ">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-c2"></div>

      </div>
    );
  }

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
        // Add these responsive settings
        breakpoints={{
          // when window width is >= 320px
          320: {
            slidesPerView: 1,
            spaceBetween: 0
          },
          // when window width is >= 640px
          640: {
            slidesPerView: 1,
            spaceBetween: 0
          }
        }}
        // Ensure swiper initializes properly
        onInit={(swiper) => {
          swiper.update();
          swiper.slideTo(0);
        }}
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={slide.secureUrl}
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
                // Changed from lazy to eager for above-the-fold images
                loading="eager"
                // Add proper dimensions to prevent layout shift
                width="100%"
                height="100%"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Centered Button - Only show when images are loaded */}
      {!loading && (
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
      )}
    </div>
  );
};

export default Hero;