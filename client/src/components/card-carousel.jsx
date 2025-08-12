import React, { useEffect, useState } from "react";
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

export const CardCarousel = ({
  images,
  autoplayDelay = 1000,
  showPagination = true,
  showNavigation = true,
}) => {
  const [swiperReady, setSwiperReady] = useState(false);

  useEffect(() => {
    // This will ensure Swiper is properly initialized when images change
    setSwiperReady(false);
    const timer = setTimeout(() => setSwiperReady(true), 100);
    return () => clearTimeout(timer);
  }, [images]);

  const css = `
    .card-carousel .swiper {
      width: 100%;
      padding-bottom: 50px;
    }

    .card-carousel .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 320px;
      height: 500px
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

  if (!swiperReady) return null;

  return (
    <section className="card-carousel w-full py-10">
      <style>{css}</style>
      <div className="mx-auto w-full">
        <div className="relative mx-auto flex w-full flex-col p-2 shadow-sm md:items-start md:gap-8 md:p-2">
          <div 
            data-aos="fade-up" 
            className="text-4xl py-10 text-center mx-auto flex justify-center items-center uppercase tracking-tight"
          >
            Featured Products
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                key={images.length} // This forces re-render when images change
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
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
                pagination={showPagination ? { clickable: true } : false}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : false
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                onInit={() => setSwiperReady(true)}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={`slide-${index}`}>
                    <div onClick={image.onClick} className="size-full relative">
                      <img
                        src={image.src}
                        className="size-full object-cover"
                        alt={image.alt || image.title}
                        loading="lazy"
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