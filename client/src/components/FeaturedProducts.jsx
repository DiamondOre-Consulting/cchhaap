import React, { useEffect, useState } from "react";
import { CardCarousel } from "./card-carousel";
import { useDispatch } from "react-redux";
import { getFeaturedProducts } from "@/Redux/Slices/productsSlice";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const [allFeatured, setAllFeatured] = useState([]);
  const navigate = useNavigate();

  const handleGetAllFeaturedProducts = async () => {
    try {
      const response = await dispatch(getFeaturedProducts());
      const featuredProducts = response?.payload?.data || [];

      const mappedProducts = featuredProducts.map((product) => {
        const variation = product.variations[0];
        console.log("pro", product);
        return {
          id: product._id,
          src:
            variation.thumbnailImage?.secureUrl ||
            variation.images?.[0]?.secureUrl ||
            "",
          title: product.productName,
          onClick: () => {
            console.log("clicked");
            navigate(`/each-product/${product?._id}`);
          },
        };
      });

      setAllFeatured(mappedProducts);
    } catch (error) {
      console.log("Error fetching featured products:", error);
    }
  };

  useEffect(() => {
    handleGetAllFeaturedProducts();
  }, []);

  return (
    <div className="w-full mx-auto">
      <CardCarousel
        images={allFeatured}
        autoplayDelay={1000}
        showPagination={true}
        showNavigation={true}
      />
    </div>
  );
};

export default FeaturedProducts;
