import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay } from "swiper/modules";
import PropTypes from "prop-types";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
// import { FaCartPlus, FaHeart, FaStar } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const products = [
  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/232_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/231_3d542d44-5da8-41de-9929-65415aa3a04c_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/235_216538f3-b1ae-465c-bc5f-70ac82806cc9_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/233_8526d0dd-9406-48b2-be35-43dc40824434_800x.jpg?v=1751977523",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/ee9d8ee419e248be97a78b9725b38d2a/ee9d8ee419e248be97a78b9725b38d2a.HD-1080p-7.2Mbps-50818514.mp4?v=0",
    ],
    title: "PP Electrophoretic Lacquer Plant",
  },
  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/236_58b58618-38be-4641-befd-392be0c234ff_800x.jpg?v=1751977535",
      "https://shopmulmul.com/cdn/shop/files/298_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/301_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/299_1100x.jpg?v=1751978222",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/3eb9dfa5e5ff4c23b67c5508b5d15834/3eb9dfa5e5ff4c23b67c5508b5d15834.HD-1080p-7.2Mbps-50818526.mp4?v=0",
    ],

    title: "Chrome Planting Plant",
  },
  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/232_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/231_3d542d44-5da8-41de-9929-65415aa3a04c_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/235_216538f3-b1ae-465c-bc5f-70ac82806cc9_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/233_8526d0dd-9406-48b2-be35-43dc40824434_800x.jpg?v=1751977523",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/ee9d8ee419e248be97a78b9725b38d2a/ee9d8ee419e248be97a78b9725b38d2a.HD-1080p-7.2Mbps-50818514.mp4?v=0",
    ],
    title: "PP Electrophoretic Lacquer Plant",
  },
  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/236_58b58618-38be-4641-befd-392be0c234ff_800x.jpg?v=1751977535",
      "https://shopmulmul.com/cdn/shop/files/298_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/301_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/299_1100x.jpg?v=1751978222",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/3eb9dfa5e5ff4c23b67c5508b5d15834/3eb9dfa5e5ff4c23b67c5508b5d15834.HD-1080p-7.2Mbps-50818526.mp4?v=0",
    ],

    title: "Chrome Planting Plant",
  },

  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/232_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/231_3d542d44-5da8-41de-9929-65415aa3a04c_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/235_216538f3-b1ae-465c-bc5f-70ac82806cc9_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/233_8526d0dd-9406-48b2-be35-43dc40824434_800x.jpg?v=1751977523",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/ee9d8ee419e248be97a78b9725b38d2a/ee9d8ee419e248be97a78b9725b38d2a.HD-1080p-7.2Mbps-50818514.mp4?v=0",
    ],
    title: "PP Electrophoretic Lacquer Plant",
  },
  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/236_58b58618-38be-4641-befd-392be0c234ff_800x.jpg?v=1751977535",
      "https://shopmulmul.com/cdn/shop/files/298_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/301_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/299_1100x.jpg?v=1751978222",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/3eb9dfa5e5ff4c23b67c5508b5d15834/3eb9dfa5e5ff4c23b67c5508b5d15834.HD-1080p-7.2Mbps-50818526.mp4?v=0",
    ],

    title: "Chrome Planting Plant",
  },

  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/232_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/231_3d542d44-5da8-41de-9929-65415aa3a04c_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/235_216538f3-b1ae-465c-bc5f-70ac82806cc9_800x.jpg?v=1751977523",
      "https://shopmulmul.com/cdn/shop/files/233_8526d0dd-9406-48b2-be35-43dc40824434_800x.jpg?v=1751977523",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/ee9d8ee419e248be97a78b9725b38d2a/ee9d8ee419e248be97a78b9725b38d2a.HD-1080p-7.2Mbps-50818514.mp4?v=0",
    ],
    title: "PP Electrophoretic Lacquer Plant",
  },
  {
    img: [
      "https://shopmulmul.com/cdn/shop/files/236_58b58618-38be-4641-befd-392be0c234ff_800x.jpg?v=1751977535",
      "https://shopmulmul.com/cdn/shop/files/298_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/301_1100x.jpg?v=1751978222",
      "https://shopmulmul.com/cdn/shop/files/299_1100x.jpg?v=1751978222",
    ],
    video: [
      "https://shopmulmul.com/cdn/shop/videos/c/vp/3eb9dfa5e5ff4c23b67c5508b5d15834/3eb9dfa5e5ff4c23b67c5508b5d15834.HD-1080p-7.2Mbps-50818526.mp4?v=0",
    ],

    title: "Chrome Planting Plant",
  },
];

const ProductItem = ({ product }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isWish, setIsWish] = useState(false);

  const toggleWishList = () => {
    setIsWish((prev) => !prev);
  };

  return (
    <div className=" ">
      <div className="relative h-full ">
        <div className=" flex justify-center items-center px-4">
          <Swiper
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            modules={[Navigation, Autoplay]}
            className="w-full h-full relative"
          >
            {[
              ...(product.video || []).map((media) => ({
                type: "video",
                src: media,
              })),
              ...(product.img || []).map((media) => ({
                type: "image",
                src: media,
              })),
            ].map((media, index) => (
              <SwiperSlide key={index}>
                {media.type === "video" ? (
                  <video
                    src={media.src}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full mx-auto  h-[500px] object-cover"
                  />
                ) : (
                  <img
                    src={media.src}
                    alt={`Slide ${index}`}
                    className="w-full mx-auto  h-[500px] object-cover"
                  />
                )}
              </SwiperSlide>
            ))}

            <Link to={'/each-product/68886bfa6e557e27a8ef3e53'} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white  px-6 py-2 z-40 shadow-md">
              Quick View
            </Link>
          </Swiper>

          <div className="absolute top-2 left-6 bg-white/60  p-2 z-40 shadow-md rounded-full">
            {isWish ? (
              <FaHeart
                className="text-xl font-bold cursor-pointer text-red-600 "
                onClick={toggleWishList}
              />
            ) : (
              <CiHeart
                className="text-xl font-bold cursor-pointer"
                onClick={toggleWishList}
              />
            )}
          </div>

          <div className="absolute flex items-center gap-2 right-6 top-2">
            <div
              ref={prevRef}
              className="z-10 flex items-center justify-center w-8 h-8 text-black bg-white rounded-full cursor-pointer custom-prev"
            >
              <BsArrowLeft />
            </div>
            <div
              ref={nextRef}
              className="z-10 flex items-center justify-center w-8 h-8 text-black bg-white rounded-full cursor-pointer custom-next"
            >
              <BsArrowRight />
            </div>
          </div>
        </div>
      </div>

      {/* <div className="relative p-4 lg:p-6 text-start">
        <a href="#!">
          <h5 className="text-[1.3rem] font-medium ">{product.title}</h5>
        </a>
      </div> */}
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

const Products = () => {
  return (
    <div>
      <section className="relative z-10 overflow-hidden ezy__epgrid5 light py-14 md:py-10 ">
        <div className=" px-4 mx-auto">
          <h2 className="text-4xl sm:text-6xl md:text-[3rem] font-medium leading-none  text-center">
            Our Products
          </h2>
          <div className="grid grid-cols-4 gap-y-6 mt-20 text-center">
            {products.map((product, i) => (
              <div className="" key={i}>
                <ProductItem product={product} />{" "}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
