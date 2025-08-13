import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { FaSpinner } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "swiper/css/pagination";
import { Navigation, Autoplay } from "swiper/modules";
import PropTypes from "prop-types";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  addToWishlist,
  getAllProducts,
  getCategorizedProduct,
  getGenderWiseProduct,
  removeFromWishlist,
} from "@/Redux/Slices/productsSlice";
import { getNavbarCartWishlistCount } from "@/Redux/Slices/cart";

const ProductItem = ({ product, isLoggedIn }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [isWish, setIsWish] = useState(product.isInWishlist || false);
  const [isWishLoading, setIsWishLoading] = useState(false);

  // Check if all variations are out of stock
  const isOutOfStock =
    product.variations?.every((v) => v.quantity === 0) || false;

  const toggleWishList = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!isWish) {
      handleAddToWishlist(product._id);
    } else {
      handleRemoveFromWishlist(product._id);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      setIsWishLoading(true);
      const response = await dispatch(addToWishlist(productId));
      dispatch(getNavbarCartWishlistCount());
      if (response?.payload?.success) {
        setIsWish(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsWishLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      setIsWishLoading(true);
      const response = await dispatch(removeFromWishlist(productId));
      dispatch(getNavbarCartWishlistCount());

      if (response?.payload?.success) {
        setIsWish(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsWishLoading(false);
    }
  };

  const firstVariation = product.variations?.[0];
  const mediaItems = [
    ...(firstVariation?.images || []).map((img) => ({
      type: img.secureUrl.includes("video") ? "video" : "image",
      src: img.secureUrl,
    })),
    ...(firstVariation?.thumbnailImage
      ? [
          {
            type: "image",
            src: firstVariation.thumbnailImage.secureUrl,
          },
        ]
      : []),
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative">
      {isOutOfStock && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30">
          <span className="bg-white px-4 py-2 font-bold rotate-[-15deg] text-lg">
            OUT OF STOCK
          </span>
        </div>
      )}
      <div className={`h-full ${isOutOfStock ? "grayscale" : ""}`}>
        <div className="flex justify-center items-center ">
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
            {mediaItems.map((media, index) => (
              <SwiperSlide key={index}>
                {media.type === "video" ? (
                  <video
                    src={media.src}
                    controls
                    autoPlay
                    muted
                    loop
                    className="w-full mx-auto h-[500px] object-cover"
                  />
                ) : (
                  <img
                    src={media.src}
                    alt={`${product.productName} - ${index}`}
                    className="w-full mx-auto h-[500px] object-cover"
                  />
                )}
              </SwiperSlide>
            ))}

            {!isOutOfStock && (
              <Link
                to={`/each-product/${product._id}`}
                className="absolute text-c1 bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 z-40 shadow-md"
              >
                Quick View
              </Link>
            )}
          </Swiper>

          <div className="absolute top-2 left-6 bg-white/60 p-2 z-40 shadow-md rounded-full">
            {isWishLoading ? (
              <FaSpinner className="text-xl animate-spin" />
            ) : isWish ? (
              <FaHeart
                className="text-xl font-bold cursor-pointer text-red-600"
                onClick={toggleWishList}
              />
            ) : (
              <CiHeart
                className="text-xl font-bold cursor-pointer text-c1"
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
      {/* <div className={`mt-2 text-center ${isOutOfStock ? 'opacity-70' : ''}`}>
        <h3 className="text-lg line-clamp-1 font-medium">
          {product.productName}
        </h3>
        {firstVariation && (
          <p className="font-bold">
            ₹{firstVariation.price}
            {firstVariation.discountPrice > 0 && (
              <span className="ml-2 text-sm text-red-500 line-through">
                ₹
                {Math.round(
                  firstVariation.price +
                    (firstVariation.price * firstVariation.discountPrice) / 100
                )}
              </span>
            )}
          </p>
        )}
      </div> */}
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

const Products = () => {
  const dispatch = useDispatch();
  const { id, gender, categoryName: urlCategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const categoryName = urlCategoryName || location.state?.categoryName || "";
  const { user, isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: false,
      easing: "ease-in-out",
      offset: 100,
    });

    AOS.refresh();
  }, [products]);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (gender) {
        response = await dispatch(
          getGenderWiseProduct({ gender, userId: user?.data?._id })
        );
      } else if (id) {
        response = await dispatch(
          getCategorizedProduct({ id, userId: user?.data?._id })
        );
      } else {
        response = await dispatch(getAllProducts({ userId: user?.data?._id }));
      }

      const productsData =
        response?.payload?.data?.products ||
        response?.payload?.data ||
        response?.payload ||
        [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [id, gender, user?._id, user, isLoggedIn]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  const getTitle = () => {
    if (gender) {
      return `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection`;
    }
    if (categoryName) {
      return `${categoryName} `;
    }
    return "Our Products";
  };

  return (
    <div>
      <section className="relative z-10 overflow-hidden ezy__epgrid5 light py-14 md:py-10">
        <div className="px-4 mx-auto">
          <h2 className="text-4xl sm:text-6xl md:text-[3rem] font-medium leading-none text-center">
            {getTitle()}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg mb-4">No products found</p>
              <Link to="/all-products" className="bg-c2 text-c1 px-10 py-2">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20">
              {products?.map((product, index) => (
                <div
                  data-aos="fade-up"
                  data-aos-delay={(index % 4) * 100}
                  key={product._id}
                >
                  <ProductItem product={product} isLoggedIn={isLoggedIn} />
                  <div className="mt-2 text-center">
                    <h3 className="text-lg line-clamp-1 font-medium">
                      {product.productName}
                    </h3>
                    {product.variations?.[0] && (
                      <p className="font-bold">
                        {product.variations[0].discountPrice?.toLocaleString(
                          "en-US",
                          {
                            style: "currency",
                            currency: "INR",
                          }
                        )}
                        {product.variations[0].discountPrice > 0 && (
                          <span className="ml-2 text-sm text-red-500 line-through">
                            ₹{product.variations[0].price}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
