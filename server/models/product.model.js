import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    brandName: {
      type: String,
      trim: true,
      default: "cchhaap",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: [{ type: String, required: true }],
    description: {
      type: String,
      required: true,
    },
 
    totalRatingSum: { type: Number, default: 0 },
    totalRatingsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, required: true },
    sku: { type: String, required: true, unique: true },

    variations: [
      {
        size: {
          type: String,
          enum: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
        },
        color: {
          name: { type: String, required: true },
          hex: { type: String, required: true },
        },
        fabric: {
          type: String,
          enum: [
            "Cotton",
            "Silk",
            "Rayon",
            "Polyester",
            "Linen",
            "Wool",
            "Blended",
            "Other",
          ],
        },
           discountType: {
              type: String,
              enum: ["percentage", "fixed"],
              default: "percentage",
       },
        gender: {
          type: String,
          enum: ["Men", "Women", "Unisex", "Kids"],
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discountPrice: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
        },
        inStock: {
          type: Boolean,
          default: true,
        },
        stock:{
          type: Number
        },
        soldCount: { type: Number, default: 0 },

        thumbnailImage: {
          secureUrl: { type: String },
          publicId: { type: String },
          uniqueId: { type: String },
        },
        images: [
          {
            secureUrl: { type: String },
            publicId: { type: String },
            uniqueId: { type: String },
          },
        ],

        attributes: {
            type: Map,
            of: String,
            default: new Map()
        },

        attributeDefinition: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AttributeDefinition",
        },
      },
    ],
  },
  { timestamps: true }
);

productSchema.index({ sku: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);

export default Product;
