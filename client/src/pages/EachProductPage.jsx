import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getSingleProduct } from "@/Redux/Slices/productsSlice";
import { useNavigate, useParams } from "react-router-dom";
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
      <div className="text-center flex md:flex-row flex-col-reverse gap-8 overflow-hidden m-2">
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

const ColorVariant = ({ groupedByColor, selectedVariation, onColorChange }) => {
  // Get all available colors from the groupedByColor object
  const availableColors = Object.keys(groupedByColor || {});

  return (
    <div className="">
      <h5 className="font-medium mb-2">
        Available Color:{" "}
        <span className="opacity-50">{selectedVariation?.color?.name}</span>
      </h5>
      <div className="flex flex-wrap gap-2 mb-2">
        {availableColors.map((colorName) => {
          const colorGroup = groupedByColor[colorName];
          const isSelected = selectedVariation?.color?.name === colorName;

          return (
            <div
              key={colorName}
              onClick={() => {
                const firstVariation = colorGroup.variations[0];
                onColorChange(firstVariation);
              }}
              className={`cursor-pointer ${
                isSelected ? "ring-2 ring-[#620A1A]" : ""
              }`}
            >
              <img
                src={colorGroup.thumbnailImage?.secureUrl}
                alt={colorName}
                className="w-20 h-20 object-cover"
                title={colorName}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SizeVariant = ({
  selectedSize,
  onSizeChange,
  selectedVariation,
  colorSizeMap,
  groupedByColor,
}) => {
  // All possible sizes to display
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

  // Get available sizes for the currently selected color
  const availableSizesForColor =
    colorSizeMap[selectedVariation?.color?.name] || [];

  return (
    <div className="mb-6">
      <h5 className="text-sm font-medium mb-2">
        Available Size:
        <span className="opacity-50 ml-1">{selectedSize}</span>
      </h5>
      <div className="flex gap-2 mb-2 flex-wrap">
        {allSizes.map((size) => {
          const isAvailable = availableSizesForColor.includes(size);
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => {
                if (isAvailable) {
                  // Find the variation with this size and current color
                  const colorGroup =
                    groupedByColor[selectedVariation.color.name];
                  const variation = colorGroup.variations.find(
                    (v) => v.size === size
                  );
                  if (variation) {
                    onSizeChange(size, variation);
                  }
                }
              }}
              className={`px-4 py-2 rounded transition-all duration-200 ${
                isSelected
                  ? "bg-c2 border border-blue-900 text-white border-2 border-c2"
                  : isAvailable
                  ? "bg-c2 text-black border-2 border-gray-200 cursor-pointer hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 line-through border-2 border-gray-100 cursor-not-allowed"
              }`}
              disabled={!isAvailable}
              title={
                !isAvailable
                  ? "This size is not available for the selected color"
                  : ""
              }
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const EachProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [singleData, setSingleData] = useState();
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const { user, isLoggedIn } = useSelector((state) => state?.user);
  const [isWish, setIsWish] = useState(false);
  const navigate = useNavigate();
  const [qty, setQty] = useState(0);
  console.log(user, isLoggedIn);
  console.log("singleData", singleData);
  const handleGetSingleProduct = async () => {
    try {
      const response = await dispatch(
        // color, size, variationId, attributes
        getSingleProduct({ id, userId: user?.data?._id   })
      );
      setSingleData(response?.payload?.data);
      if (response?.payload?.data?.variations?.length > 0) {
        const firstVariation = response.payload.data.variations[0];
        setSelectedVariation(firstVariation);
        setSelectedSize(firstVariation.size);
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

  const handleSizeChange = (size, variation) => {
    setSelectedSize(size);
    setSelectedVariation(variation);
    setQty(0);
  };

  const toggleWishList = () => {
    setIsWish((prev) => !prev);
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
      console.log(response);
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const [selectedAttributes, setSelectedAttributes] = useState({});

  useEffect(() => {
    if (singleData?.attributes) {
      const initialAttributes = {};
      Object.entries(singleData.attributes).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          initialAttributes[key] = value[0];
        } else {
          initialAttributes[key] = value;
        }
      });
      setSelectedAttributes(initialAttributes);
    }
  }, [singleData]);

  const handleAttributeClick = (attributeName, option) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: option,
    }));
  };

  const renderAttributeOptions = () => {
    if (!singleData?.attributes) return null;

    return (
      <div className="space-y-6">
        {Object.entries(singleData.attributes).map(
          ([attributeName, options]) => {
            const optionsArray = Array.isArray(options) ? options : [options];

            return (
              <div key={attributeName}>
                <p className="font-medium">{attributeName}</p>
                <div className="flex w-full gap-x-4 mt-1">
                  {optionsArray.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={` w-full text-sm py-2 border ${
                        selectedAttributes[attributeName] === option
                          ? "bg-c2 text-c1"
                          : "border-white"
                      }`}
                      onClick={() =>
                        handleAttributeClick(attributeName, option)
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </div>
    );
  };

  //   const handleAttributeClick = (attributeName, option) => {
  //   setSelectedAttributes(prev => ({
  //     ...prev,
  //     [attributeName]: option
  //   }));
  // };
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
                    groupedByColor={singleData?.groupedByColor}
                    selectedVariation={selectedVariation}
                    onColorChange={handleColorChange}
                  />
                </div>
                <div className="mb-6">
                  <SizeVariant
                    selectedSize={selectedSize}
                    onSizeChange={handleSizeChange}
                    selectedVariation={selectedVariation}
                    colorSizeMap={singleData?.colorSizeMap || {}}
                    groupedByColor={singleData?.groupedByColor || {}}
                  />
                </div>
                {renderAttributeOptions()}

                <div className="flex flex-wrap gap-3 items-center my-7">
                  {!selectedVariation?.cartQuantity ||
                  selectedVariation?.cartQuantity === 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!isLoggedIn) {
                          navigate("/login");
                        } else {
                          setQty(1);
                        }
                      }}
                      className="border border-c2 text-white cursor-pointer hover:bg-[#edb141] hover:text-white text-sm uppercase px-6 py-4 md:px-12 min-w-[202px]"
                    >
                      Add To Cart
                    </button>
                  ) : (
                    <div className="flex items-center border border-[#edb141] px-4 py-2 min-w-[202px] justify-between text-[#edb141]">
                      <button
                        type="button"
                        onClick={() =>
                          setQty(
                            Math.max(
                              (selectedVariation?.cartQuantity || 0) - 1,
                              0
                            )
                          )
                        }
                        className="text-2xl font-bold px-2 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-lg">
                        {selectedVariation?.cartQuantity || 0}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQty(
                            Math.min(
                              (selectedVariation?.cartQuantity || 0) + 1,
                              selectedVariation?.quantity || 1
                            )
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
  onClick={async () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      // Ensure we have a selected variation
      if (!selectedVariation) {
        alert("Please select a color and size first");
        return;
      }
      
      // If quantity is 0, set it to 1 (minimum purchase quantity)
      const finalQuantity = qty === 0 ? 1 : qty;
      
      // Update cart with the quantity (if needed)
      if (qty === 0) {
        await dispatch(
          userUpdateCart({
            quantity: finalQuantity,
            productId: id,
            variationId: selectedVariation._id,
          })
        );
      }
      
      // Navigate to checkout with all required parameters
      navigate(
        `/checkout?product=${id}&variation=${selectedVariation._id}&quantity=${finalQuantity}`
      );
    }
  }}
  className="bg-c2 border text-white text-sm uppercase hover:bg-opacity-90 px-10 py-4 md:px-12 min-w-[202px]"
>
  Buy it Now
</button>
                </div>

                <div
                  className="mt-10"
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
