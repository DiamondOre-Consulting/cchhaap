import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { allWislist, removeFromWishlist } from "@/Redux/Slices/productsSlice";
import { Link } from "react-router-dom";
import { getNavbarCartWishlistCount } from "@/Redux/Slices/cart";

const Wishlist = () => {
  const [qty, setQty] = useState(1);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleGetAllWishlistProducts = async () => {
    try {
      setLoading(true);
      const response = await dispatch(allWislist());
            
      
      console.log(response)
      setWishlistData(response?.payload?.data?.wishList?.[0]?.products || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlist(productId));
            dispatch(getNavbarCartWishlistCount())

      handleGetAllWishlistProducts();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  useEffect(() => {
    handleGetAllWishlistProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className=" container py-8">
  <h1 className="text-3xl text-center font-semibold mb-8 text-white">My Wishlist</h1>

  {wishlistData.length === 0 ? (
    <div className="text-center py-10  rounded-xl">
      <p className="text-lg text-gray-200">Your wishlist is empty</p>
      <Link
        to="/"
        className="mt-4 inline-block bg-c2 text-c1 px-8 py-2 rounded-md font-medium hover:bg-c2/90 transition"
      >
        Browse Products
      </Link>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-10 gap-8">
      {wishlistData.map((item) => {
        const product = item?.productId;
        const firstVariation = product?.variations?.[0];
        const thumbnail =
          firstVariation?.thumbnailImage?.secureUrl ||
          firstVariation?.images?.[0]?.secureUrl;

        return (
          <div
            key={item?._id}
            className="relative bg-white/5 border border-white/10 w-full  mx-auto rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition duration-300"
          >
            {thumbnail && (
              <Link to={`/each-product/${product?._id}`}>
                <img
                  src={thumbnail}
                  alt={product?.productName}
                  className="h-80 w-full object-cover"
                  loading="lazy"
                />
              </Link>
            )}

            <div className="p-4">
              <Link to={`/each-product/${product?._id}`}>
                <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                  {product?.productName}
                </h3>
                <p className="text-sm text-gray-400 mb-2">
                  {product?.brandName}
                </p>
              </Link>

              {firstVariation && (
                <div className="flex flex-col items-start">
                  <p className="text-lg font-bold text-white">
                        {firstVariation?.discountPrice?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    {firstVariation?.discountPrice > 0 && (
                      <span className="ml-2 text-sm text-red-400 line-through">
                        ₹
                          {firstVariation?.price?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                      </span>
                    )}
                  </p>

                  <Link  to={`/each-product/${product?._id}`}  className="w-full text-center bg-c2 text-c1 mt-3 py-2 rounded-md font-medium hover:bg-c2/90 transition">
                    View Product
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                handleRemoveFromWishlist(product._id);
              }}
              className="absolute top-3 right-3 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-600 transition"
              aria-label="Remove from wishlist"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  )}
</div>

  );
};

export default Wishlist;
