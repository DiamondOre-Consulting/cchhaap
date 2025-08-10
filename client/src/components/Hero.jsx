import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetAllBannerImages } from "../Redux/Slices/authSlice";

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);

  const handleGetAllImage = async () => {
    try {
      const res = await dispatch(GetAllBannerImages());
      console.log("banners", res?.payload?.data[0]?.bannerImage);
      setImages(res?.payload?.data[0]?.bannerImage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllImage();
  }, []);

  console.log(images);
  return (
    <div>
      <div className="relative h-[40vh] md:h-screen">
        <div className="w-full relative top-0 h-[40vh] md:h-screen">
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              waitForTransition: true,
            }}
            pagination={{
              clickable: true,
            }}
            allowTouchMove={false}
            loop={true}
            direction="vertical"
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full h-full custom-swiper"
          >
            {images.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.secureUrl}
                    className="w-full h-full object-cover"
                    alt={`Slide ${index + 1}`}
                  />

                  <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                  <div className="absolute inset-0 flex  flex-col mx-auto  justify-center items-start text-left px-4  md:px-20 z-20">
                    <motion.h1
                      key={
                        activeIndex === index
                          ? `active-${index}`
                          : `inactive-${index}`
                      }
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="text-white text-[2.6rem] md:text-[4.6rem] uppercase flex flex-col font-[1000] tracking-wider md:leading-[88px] myfont"
                    >
                      {/* <span>{category}</span> */}
                      {/* <span className="mytext text-[2rem] md:text-[5rem]">
                      Projects
                    </span> */}
                    </motion.h1>

                    <Link
                      to={"/all-products"}
                      class="group relative inline-flex h-12 mx-auto items-center justify-center overflow-hidden  font-medium"
                    >
                      <div class="inline-flex  border border-neutral-200 h-12 translate-x-0 items-center justify-center uppercase px-6 text-neutral-100 transition group-hover:-translate-x-[150%]">
                        Explore Project
                      </div>
                      <div class="absolute  border border-[#6d0c04] inline-flex h-12 w-full translate-x-[100%] items-center justify-center bg-[#6d0c04]/60 px-6 text-neutral-50 transition duration-300 group-hover:translate-x-0">
                        Explore Project
                      </div>
                    </Link>
                    {/* <motion.div
                      className="flex mt-6 md:mt-10 space-x-3 w-fit mx-auto py-2 px-10 flex border border-[#edb141] border-1  justify-center  text-xl"
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Link
                        // to={`/project/${category}`}
                        className="text-white uppercase hover:underline  px-2 cursor-pointer"
                      >
                        View Projects
                      </Link>
                      <MoveRight className="mytext" />
                    </motion.div> */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <style>{`
        .custom-swiper .swiper-pagination-bullets {
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
        }
        .custom-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.6;
          margin: 6px 0;
        }
        .custom-swiper .swiper-pagination-bullet-active {
          background: #000000ff;
          opacity: 1;
        }
      `}</style>
        </div>
      </div>
    </div>
  );
};

export default Hero;
