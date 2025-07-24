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
  fabric: "",
  quantity: 0,
  gender: "",
  discountType: "percentage",
  isActive: true,
  sku: "",
  variations: [
    {
      size: "",
      color: { name: "", hex: "" },
      price: 0,
      gender:'',
      discountPrice: 0,
      quantity: 0,
      sku: "",
      inStock: true,
      soldCount: 0,
      thumbnailImage: { secureUrl: "", publicId: ""  , uniqueId:""},
      images: [{ secureUrl: "", publicId: ""  , uniqueId:"" }],
      attributes: {}, // example: { Occasion: "Party" }
      attributeDefinition: ""
    }
  ]
};

