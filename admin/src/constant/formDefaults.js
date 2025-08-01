export const defaultCategoryValues = {
  categoryName: "",
  categoryImage: "",
};
export const productDefaultValues = {
  productName: "",
  brandName: "cchhaap",
  category: "",
  subCategory: [""],
  description: "",
  quantity: 0,
  gender: "",
  discountType: "percentage",
  isActive: true,
  sku: "",
  featuredProduct:true,
  variations: [
    {
      size: "",
      color: { name: "", hex: "" },
        fabric: "",
      price: 0,
      gender:'',
      discountPrice: 0,
      quantity: 0,
      // sku: "",
      inStock: true,
      soldCount: 0,
      thumbnailImage: { secureUrl: "", publicId: ""  , uniqueId:""},
      images: [{ secureUrl: "", publicId: ""  , uniqueId:"" }],
      attributes: {}, 
      attributeDefinition: ""
    }
  ]
};

