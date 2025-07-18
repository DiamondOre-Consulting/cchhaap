import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName : {
    type:String,
    required : true,
    trim:true,
   },
    brandName: {
        type: String,
        trim: true,
        defaule:"cchhaap"
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: [{ type: String, required:true }], 
    description: {
        type: String,
        required: true
    },
    fabric:{
        type: String,
        required: true
    },
    
  quantity: {
    type: Number,
    default: 0
  },
  fabric: {
    type: String,
    enum: ['Cotton', 'Silk', 'Rayon', 'Polyester', 'Linen', 'Wool', 'Blended', 'Other']
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids'],
    required: true
  },
   discountType : {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage"
   },
   totalRatingSum: { type: Number, default: 0 },
   totalRatingsCount: { type: Number, default: 0 },
   isActive: { type: Boolean, default: true, required: true },
   sku : {type:String, required:true, unique:true},

   variations: [
      {
        size: {
          type: String,
          enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
        },
        color: {
                name: { type: String, required: true },      
                hex: { type: String, required: true }          
        },
        price: {
          type: Number,
          required: true
        },
        discountPrice: {
          type: Number
        },
        quantity: {
          type: Number,
          required: true
        },
        sku: {
          type: String,
          required: true,
          unique: true
        },
        inStock:{
           type: Boolean,
           default: true
        },
        soldCount: { type: Number, default: 0 },
        quantity: {
            type: Number,
            required: true
        },
        thumbnailImage:{ secureUrl:{type : String}, publicId:{ type : String }},
        images: [{ secureUrl:{type : String}, publicId:{ type : String }}],
      }
    ],



  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;