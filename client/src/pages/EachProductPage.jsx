import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getSingleProduct } from "@/Redux/Slices/productsSlice";
import { useParams } from "react-router-dom";

const product = {
  title: "Elusha Lime Organza Kurta Set",
  previews: [
    {
      previewUrl:
        "https://shopmulmul.com/cdn/shop/files/232_800x.jpg?v=1751977523",
      thumbUrl:
        "https://shopmulmul.com/cdn/shop/files/232_800x.jpg?v=1751977523",
    },
    {
      previewUrl:
        "https://shopmulmul.com/cdn/shop/files/231_3d542d44-5da8-41de-9929-65415aa3a04c_800x.jpg?v=1751977523",
      thumbUrl:
        "https://shopmulmul.com/cdn/shop/files/231_3d542d44-5da8-41de-9929-65415aa3a04c_800x.jpg?v=1751977523",
    },
    {
      previewUrl:
        "https://shopmulmul.com/cdn/shop/files/233_8526d0dd-9406-48b2-be35-43dc40824434_800x.jpg?v=1751977523",
      thumbUrl:
        "https://shopmulmul.com/cdn/shop/files/233_8526d0dd-9406-48b2-be35-43dc40824434_800x.jpg?v=1751977523",
    },
    {
      previewVedio:
        "https://shopmulmul.com/cdn/shop/videos/c/vp/3eb9dfa5e5ff4c23b67c5508b5d15834/3eb9dfa5e5ff4c23b67c5508b5d15834.HD-1080p-7.2Mbps-50818526.mp4?v=0",
      thumbVedio:
        "https://shopmulmul.com/cdn/shop/videos/c/vp/3eb9dfa5e5ff4c23b67c5508b5d15834/3eb9dfa5e5ff4c23b67c5508b5d15834.HD-1080p-7.2Mbps-50818526.mp4?v=0",
    },
  ],
  rating: 5.0,
  rateCount: 3,
  price: 13950,
  colorVariants: [
    { bgcolor: "bg-yellow-500", value: "Multi" },
    { bgcolor: "bg-blue-500", value: "Blue" },
    { bgcolor: "bg-red-400", value: "Pink" },
    { bgcolor: "bg-black", value: "Black" },
    { bgcolor: "bg-red-600", value: "Red" },
  ],
  sizeVariants: [
    {
      label: "XS",
    },
    {
      label: "S",
    },
    {
      label: "M",
    },
    {
      label: "L",
    },
    {
      label: "XL",
    },
    {
      label: "XXL",
    },
  ],
};

const ProductPreviews = ({ previews }) => {
  // console.log("Previews:", previews);

  const [index, setIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const isVideo = (url) => {
    return url?.toLowerCase().endsWith(".mp4");
  };

  const currentPreview = previews?.[index];
  const isCurrentVideo = isVideo(currentPreview?.secureUrl);

  return (
    <div className="lg:mr-6">
      <div className="text-center flex gap-8 overflow-hidden m-2">
        <ul className="flex flex-nowrap gap-3 flex-col">
          {previews?.map((preview, i) => {
            const isSelected = i === index;
            const url = preview?.secureUrl;

            return (
              <li
                key={preview._id || i}
                className={`${
                  isSelected
                    ? "border-2 border-[#620A1A]"
                    : "border-2 border-transparent"
                } rounded overflow-hidden p-1 cursor-pointer`}
                onClick={() => setIndex(i)}
              >
                {isVideo(url) ? (
                  <video
                    src={url}
                    className="w-auto max-h-[150px] rounded object-cover"
                    muted
                    playsInline
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    src={url}
                    alt=""
                    className="w-auto max-h-[150px] rounded object-cover"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="max-w-[650px] w-full">
          {isCurrentVideo ? (
            <video
              src={currentPreview?.secureUrl}
              className="w-full max-h-[650px] object-cover rounded"
              controls
              autoPlay
              loop
            />
          ) : (
            <div className="overflow-hidden">
              <img
                src={currentPreview?.secureUrl}
                alt=""
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={(e) => {
                  const { left, top, width, height } =
                    e.target.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  setMousePosition({ x, y });
                }}
                className="max-w-[600px] object-cover w-full"
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  transform: isZoomed ? "scale(4)" : "scale(1)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



const ColorVariant = () => {
  const [selectedColor, setSelectedColor] = useState("Multi");

  const handleColorChange = (value) => {
    setSelectedColor(value);
  };

  return (
    <>
      <div className="">
        <h5 className="font-medium mb-2">
          Available Color:{" "}
          <span className="opacity-50">
            {selectedColor &&
              product.colorVariants.find(
                (color) => color.value === selectedColor
              )?.value}
          </span>
        </h5>
        <div className="flex flex-wrap gap-2 mb-2">
          {product.colorVariants.map((item, i) => (
            <Fragment key={i}>
              <input
                type="radio"
                className="absolute hidden"
                autoComplete="off"
                checked={selectedColor === item.value}
                onChange={() => handleColorChange(item.value)}
              />
              <label
                className={`w-8 h-8 rounded-full ${
                  item.bgcolor
                } border-2 border-white dark:border-[#0b1727] cursor-pointer mt-1 hover:outline hover:outline-1 hover:outline-${
                  item.color
                } ${
                  selectedColor === item.value &&
                  `outline outline-1 outline-${item.color}`
                }`}
                onClick={() => handleColorChange(item.value)}
              ></label>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

const SizeVariant = () => {
  const [selectedSize, setSelectedSize] = useState("XS");

  const handleSizeChange = (value) => {
    setSelectedSize(value);
  };

  return (
    <div className="mb-6">
      <h5 className="text-sm font-medium mb-2">
        Size:
        <span className="opacity-50 ml-1">{selectedSize}</span>
      </h5>
      <div className="flex gap-2 mb-2">
        {product.sizeVariants.map((size) => (
          <button
            key={size.label}
            type="button"
            onClick={() => handleSizeChange(size.label)}
            className={`px-4 py-2 rounded transition-all duration-200 cursor-pointer
          ${
            selectedSize === size.label
              ? "bg-c1 text-white"
              : "bg-gray-200 text-black"
          }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const EachProductPage = () => {
 const {id} = useParams()
  const dispatch = useDispatch()
  const [singleData , setSingleData] = useState();

  const handleGetSingleProduct = async () => {
    try {
      const response = await dispatch(getSingleProduct(id));
      console.log("single",response)
      setSingleData(response?.payload?.data)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetSingleProduct();
  }, []);

  const [formData, setFormData] = useState({
    color: "Multi",
    size: "XL",
    qty: 1,
  });

  const setField = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const [isWish, setIsWish] = useState(false);

  const toggleWishList = () => {
    setIsWish((prev) => !prev);
  };

  const [qty, setQty] = useState(0);
console.log(singleData, "sddfg")
  return (
    <div>
      <section className="py-14 md:py-10    relative overflow-hidden z-10">
        <div className="container px-6 md:px-20 mx-auto">
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-5 lg:col-span-3">
              <ProductPreviews previews={singleData?.variations[0].images} />
            </div>
            <div className="col-span-2 lg:col-span-2">
              <div className="mb-4">
                <h1 className="text-2xl leading-none md:text-4xl font-medium mb-4">
                  {singleData?.productName}
                </h1>
                <p className="opacity-70 mb-6">
                  {/* <span>{product.rating}</span>{" "} */}
                  {/* <FontAwesomeIcon
									icon={faStar}
									className="mx-2 text-yellow-500"
								/> */}
                  {/* <a href="#!" className="text-blue-600 font-medium ml-1">
                    {product.rateCount} Reviews
                  </a>{" "} */}
                  {/* <span className="ml-2">104 Order</span> */}
                </p>

                <div>
                  <div className="flex items-center   gap-x-4">
                    <h3 className="text-2xl  font-medium">
                      {" "}
                      {singleData.variations[0].price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h3>
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

                  <p className="text-sm mt-1">Inclusive Of All Taxes.</p>
                </div>

                <div className="w-full bg-white/40 mt-10 h-[1px]"></div>
                <p className="text-red-400 text-sm py-2">
                  Only {singleData?.variations[0].quantity} items left !{" "}
                </p>
              </div>

              <form action="#!">
                <div className="mb-6">
                  <ColorVariant />
                </div>
                <div className="mb-6">
                  <SizeVariant />
                </div>

                <div className="flex flex-wrap gap-3 items-center my-7">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => setQty(1)}
                      className="border border-[#620A1A] text-white cursor-pointer hover:bg-[#edb141] hover:text-white text-sm uppercase px-6 py-4 md:px-12 min-w-[202px]"
                    >
                      Add To Cart
                    </button>
                  ) : (
                    <div className="flex items-center border border-[#edb141] px-4 py-2 min-w-[202px] justify-between text-[#edb141]">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(qty - 1, 0))}
                        className="text-2xl font-bold px-2 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-lg">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="text-2xl font-bold px-2 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    className="bg-c2 border text-white text-sm uppercase hover:bg-opacity-90 px-10 py-4 md:px-12 min-w-[202px]"
                  >
                    Buy it Now
                  </button>
                </div>

                <p className="opacity-70 ">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque nec consequat lorem. Maecenas elementum at diam
                  consequat bibendum.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EachProductPage;
