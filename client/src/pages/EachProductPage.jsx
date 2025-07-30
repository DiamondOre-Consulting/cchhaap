import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getSingleProduct } from "@/Redux/Slices/productsSlice";
import { useParams } from "react-router-dom";
import { userUpdateCart } from "@/Redux/Slices/cart";

const ProductPreviews = ({ previews }) => {
  const [index, setIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const isVideo = (url) => {
    return url?.toLowerCase().endsWith(".mp4");
  };

  const currentPreview = previews?.[index];
  const isCurrentVideo = isVideo(currentPreview?.secureUrl);

  if (!previews || previews.length === 0) {
    return <div className="lg:mr-6">No previews available</div>;
  }

  return (
    <div className="lg:mr-6">
      <div className="text-center flex md:flex-row flex-col-reverse   gap-8 overflow-hidden m-2">
        <ul className="flex flex-nowrap gap-3 flex-row md:flex-col">
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
              className="w-full -h-[650px] object-cover rounded"
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

const ColorVariant = ({ variations, selectedVariation, onColorChange }) => {

  console.log(variations)
  return (
    <div className="">
      <h5 className="font-medium mb-2">
        Available Color:{" "}
        <span className="opacity-50">{selectedVariation?.color?.name}</span>
      </h5>
      <div className="flex flex-wrap gap-2 mb-2">
        {variations?.map((variation, i) => (
          <div
            key={i}
            onClick={() => onColorChange(variation)}
            className={`cursor-pointer ${
              selectedVariation?._id === variation._id
                ? "ring-2 ring-[#620A1A]"
                : ""
            }`}
          >
            <img
              src={variation?.thumbnailImage?.secureUrl}
              alt={variation?.color?.name}
              className="w-20 h-20 object-cover"
              title={variation?.color?.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const SizeVariant = ({ sizes, selectedSize, onSizeChange }) => {
  return (
    <div className="mb-6">
      <h5 className="text-sm font-medium mb-2">
        Available Size:
        <span className="opacity-50 ml-1">{selectedSize}</span>
      </h5>
      <div className="flex gap-2 mb-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onSizeChange(size)}
            className={`px-4 py-2 rounded transition-all duration-200 cursor-pointer
              ${
                selectedSize === size
                  ? "bg-c2 text-white"
                  : "bg-gray-200 text-black"
              }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

const EachProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [singleData, setSingleData] = useState();
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedSize, setSelectedSize] = useState("XS");
  const [isWish, setIsWish] = useState(false);
  const [qty, setQty] = useState(0);

  const handleGetSingleProduct = async () => {
    try {
      const response = await dispatch(getSingleProduct(id));
      setSingleData(response?.payload?.data);
      if (response?.payload?.data?.variations?.length > 0) {
        setSelectedVariation(response.payload.data.variations[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleColorChange = (variation) => {
    setSelectedVariation(variation);
    setSelectedSize(variation.size);
    setQty(0);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setQty(0);
  };

  const toggleWishList = () => {
    setIsWish((prev) => !prev);
  };

  const getAvailableSizes = () => {
    if (!singleData || !selectedVariation) return [];
    return singleData.variations
      .filter((v) => v.color.name === selectedVariation.color.name)
      .map((v) => v.size);
  };

  useEffect(() => {
    handleGetSingleProduct();
  }, []);

  useEffect(() => {
    if (qty > 0 && selectedVariation) {
      updateCart(qty);
    }
  }, [qty]);

  const updateCart = async (newQuantity) => {
    try {
      const response = await dispatch(
        userUpdateCart({
          quantity: newQuantity,
          productId: id,
          variationId: selectedVariation._id,
        })
      );


      console.log(response)
      // await dispatch(getNavbarCartCount());

    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  return (
    <div>
      <section className="py-14 md:py-10 relative overflow-hidden z-10">
        <div className="container px-6 md:px-20 mx-auto">
          <div className="grid grid-cols-5 gap-6">
            <div className="col-span-5 lg:col-span-3">
              <ProductPreviews previews={selectedVariation?.images || []} />
            </div>
            <div className="col-span-5 lg:col-span-2">
              <div className="mb-4">
                <h1 className="text-2xl leading-none md:text-4xl font-medium mb-4">
                  {singleData?.productName}
                </h1>
                <p className="opacity-70 mb-6">
                  Brand: {singleData?.brandName}
                </p>

                <div>
                  <div className="flex items-center gap-x-4">
                    <h3 className="text-2xl font-medium">
                      {selectedVariation?.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                      {selectedVariation?.discountPrice > 0 && (
                        <span className="ml-2 text-sm line-through text-gray-500">
                          {(
                            selectedVariation.price +
                            selectedVariation.discountPrice
                          ).toLocaleString("en-US", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </span>
                      )}
                    </h3>
                    {isWish ? (
                      <FaHeart
                        className="text-xl font-bold cursor-pointer text-red-600"
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
                  Only {selectedVariation?.quantity} items left!
                </p>
              </div>

              <form action="#!">
                <div className="mb-6">
                  <ColorVariant
                    variations={singleData?.variations}
                    selectedVariation={selectedVariation}
                    onColorChange={handleColorChange}
                  />
                </div>
                <div className="mb-6">
                  <SizeVariant
                    sizes={getAvailableSizes()}
                    selectedSize={selectedSize}
                    onSizeChange={handleSizeChange}
                  />
                </div>

                <div className="flex flex-wrap gap-3 items-center my-7">
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => setQty(1)}
                      className="border border-c2 text-white cursor-pointer hover:bg-[#edb141] hover:text-white text-sm uppercase px-6 py-4 md:px-12 min-w-[202px]"
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
                        onClick={() =>
                          setQty(
                            Math.min(qty + 1, selectedVariation?.quantity || 1)
                          )
                        }
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

                <div
                  dangerouslySetInnerHTML={{ __html: singleData?.description }}
                />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EachProductPage;
