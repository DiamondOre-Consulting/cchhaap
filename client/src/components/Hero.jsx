import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  // {
  //   title: "Residential",
  //   subtitle: "Projects",
  //   image: "https://images.pexels.com/photos/32997072/pexels-photo-32997072.jpeg",
  // },
  {
    title: "Commercial",
    subtitle: "Projects",
    image: "https://shopmulmul.com/cdn/shop/files/4_48b9b663-4680-437f-9844-0a1fbc092085.jpg?v=1752212049&width=1800",
  },
  {
    title: "Institutional",
    subtitle: "Projects",
    image: "https://shopmulmul.com/cdn/shop/files/5_819b28ae-2eae-4c28-80fa-7b4fe13137fa.jpg?v=1752212049&width=1800",
  },
 
];

const Hero = () => {
      const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
        <div className="relative h-screen">
      <div className="w-full relative top-0 h-screen">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
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
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={slide.image}
                  className="w-full h-full object-cover"
                  alt={`Slide ${index + 1}`}
                />

                <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                <div className="absolute inset-0 flex  flex-col  md:max-w-5xl justify-center items-start text-left px-4  md:px-20 z-20">
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

                  <motion.div
                    className="flex mt-6 md:mt-10 space-x-3 text-xl"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Link
                    //   to={`/project/${category}`}
                      className="text-white uppercase hover:underline cursor-pointer"
                    >
                      {/* View Projects */}
                    </Link>
                    <MoveRight className="mytext" />
                  </motion.div>
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
  )
}

export default Hero
