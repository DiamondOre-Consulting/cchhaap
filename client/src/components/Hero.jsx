import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetAllBannerImages } from "../Redux/Slices/authSlice";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const [swiper, setSwiper] = useState(null);
  const [images, setImages] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  // Fix for autoplay on mobile
  useEffect(() => {
    if (swiper && images.length > 0) {
      // For mobile devices, we need to manually start autoplay after user interaction
      const handleFirstInteraction = () => {
        swiper.autoplay.start();
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };

      if (isMobile) {
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);
      } else {
        swiper.autoplay.start();
      }
    }
  }, [swiper, images, isMobile]);

  return (
    <div className="relative h-[60vh] md:h-screen">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        onSwiper={setSwiper}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: true,
        }}
        direction={isMobile ? "horizontal" : "vertical"}
        pagination={{ 
          clickable: true,
          dynamicBullets: true,
          dynamicMainBullets: 3
        }}
        loop={true}
        // effect="fade"
        // fadeEffect={{ crossFade: true }}
        className="w-full h-full"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={slide.secureUrl}
                className="w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
                loading="eager"
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
            onClick={() => {
              if (swiper) swiper.autoplay.stop();
            }}
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

      <style jsx>{`
        .swiper-pagination {
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: ${isMobile ? "row" : "column"};
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.6;
          width: ${isMobile ? "8px" : "6px"};
          height: ${isMobile ? "8px" : "6px"};
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #000000;
          opacity: 1;
          width: ${isMobile ? "12px" : "8px"};
          height: ${isMobile ? "12px" : "8px"};
        }
      `}</style>
    </div>
  );
};

export default Hero;