import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";

import { SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CardCarousel = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
    .card-carousel .swiper {
      width: 100%;
      padding-bottom: 50px;
    }

    .card-carousel .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 300px;
    }

    .card-carousel .swiper-slide img {
      display: block;
      width: 100%;
    }

    .card-carousel .swiper-3d .swiper-slide-shadow-left {
      background-image: none;
    }

    .card-carousel .swiper-3d .swiper-slide-shadow-right {
      background: none;
    }
  `;

  return (
    <section className="card-carousel w-full py-10">
      <style>{css}</style>
      <div className="mx-auto w-full w-full ">
        <div className="relative mx-auto flex w-full flex-col  border border-black/5 bg-[#C6953F]/20 p-2 shadow-sm md:items-start md:gap-8  md:p-2">
          <h3 className="text-4xl py-10 text-center mx-auto flex justify-center items-center  uppercase tracking-tight">
            Featured Products
          </h3>

          <div className="flex flex-col justify-center pb-2 pl-4  md:items-center"></div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView="auto"
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {/* First Loop */}
                {images.map((image, index) => (
                  <SwiperSlide key={`slide-1-${index}`}>
                    <div className="size-full relative">
                      <img
                        src={image.src}
                        width={600}
                        height={600}
                        className="size-full "
                        alt={image.alt}
                      />
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-fit text-black text-md text-center flex justify-center items-center bg-white px-4 py-2">
                        {image.title}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                {/* Second Loop (Preserved as Requested) */}
                {images.map((image, index) => (
                  <SwiperSlide key={`slide-2-${index}`}>
                    <div className="size-full relative">
                      <img
                        src={image.src}
                        width={200}
                        height={200}
                        className="size-full "
                        alt={image.alt}
                      />

                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-fit text-black text-md text-center flex justify-center items-center bg-white px-4 py-2">
                        {image.title}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
