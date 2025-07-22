export const defaultCategoryValues = {
  categoryName: "",
  categoryImage: "",
};

export const productDefaultValues = {
  productName: "",
  brandName: "",
  category: "",
  subCategory: [""],
  description: "",
  fabric: "",
  quantity: "",
  gender: "",
  // discountType: "",
  isActive: true,
  sku: "",
  variations: [
    {
      size: "",
      color: {
        name: "",
        hex: "#000000",
      },
      price: "",
      discountPrice: "",
      discountType:"",
      quantity: "",
      sku: "",
      inStock: true,
    },
  ],
  thumbnailImage: {
    secureUrl: "",
    publicId: "",
  },
  images: [],
};
