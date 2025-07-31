import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { allWislist, removeFromWishlist } from "@/Redux/Slices/productsSlice";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [qty, setQty] = useState(1);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleGetAllWishlistProducts = async () => {
    try {
      setLoading(true);
      const response = await dispatch(allWislist());
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-center font-semibold mb-4">My Wishlist</h1>
      
      {wishlistData.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-lg">Your wishlist is empty</p>
          <Link 
            to="/" 
            className="bg-c2 px-10 py-2 text-c1 mt-3 inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {wishlistData.map((item) => {
            const product = item.productId;
            const firstVariation = product.variations?.[0];
            const thumbnail = firstVariation?.thumbnailImage?.secureUrl || 
                            firstVariation?.images?.[0]?.secureUrl;

            return (
              <div 
                key={item._id} 
                className="relative border border-white/40 w-full w-[28rem] rounded overflow-hidden hover:shadow-md transition-shadow"
              >
                {thumbnail && (
                  <Link to={`/each-product/${product._id}`}>
                    <img
                      src={thumbnail}
                      alt={product.productName}
                      className="h-96 w-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                )}
                
                <div className="p-4 border-t border-gray-200">
                  <Link to={`/each-product/${product._id}`}>
                    <h3 className="text-lg font-medium line-clamp-1 mb-1">
                      {product.productName}
                    </h3>
                    <p className="text-gray-100 text-sm mb-3">{product.brandName}</p>
                  </Link>
                  
                  {firstVariation && (
                    <div className="flex flex-col justify-between items-start">
                      <div>
                        <p className="text-lg font-bold">
                          ₹{firstVariation.price}
                          {firstVariation.discountPrice > 0 && (
                            <span className="ml-2 text-xs text-red-400 line-through">
                              ₹{Math.round(firstVariation.price + (firstVariation.price * firstVariation.discountPrice / 100))}
                            </span>
                          )}
                        </p>
                   
                      </div>
                      <button className="w-full bg-c2 mt-2 text-c1 py-2">View  Products</button>
                    </div>
                  )}
                  
               
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFromWishlist(product._id);
                  }}
                  className="absolute cursor-pointer top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-700 transition"
                  aria-label="Remove from wishlist"
                >
                  <X size={13} />
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