import { z } from "zod";
import mongoose from "mongoose";

// Utility function to safely parse JSON strings
const safeParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

// Enhanced deep clean with type conversion
const deepClean = (value) => {
  if (Array.isArray(value)) {
    return value.map(deepClean);
  } else if (value && typeof value === 'object') {
    // Handle Mongoose Maps if present
    if (value instanceof Map) {
      return Object.fromEntries(value.entries());
    }
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deepClean(v)])
    );
  }
  return value;
};

// Enums
const sizeEnum = z.enum(["XS", "S", "M", "L", "XL", "XXL", "Free Size"]);
const fabricEnum = z.enum([
  "Cotton", "Silk", "Rayon", "Polyester", 
  "Linen", "Wool", "Blended", "Other"
]);
const genderEnum = z.enum(["Men", "Women", "Unisex", "Kids"]);
const discountTypeEnum = z.enum(["percentage", "fixed"]);

// Image schema
const imageSchema = z.object({
  secureUrl: z.string().optional(),
  publicId: z.string().optional(),
  uniqueId: z.string().optional()
});

// More flexible hex color validation
const hexColorSchema = z.preprocess(
  val => {
    if (typeof val === 'string') {
      // Remove quotes if present
      const cleaned = val.replace(/^"(.*)"$/, '$1');
      // Add # if missing
      return cleaned.startsWith('#') ? cleaned : `#${cleaned}`;
    }
    return val;
  },
  z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid hex color code")
);

// Variation schema with robust preprocessing
const variationSchema = z.object({
  size: sizeEnum.optional(),
  color: z.object({
    name: z.string().min(1, "Color name is required"),
    hex: hexColorSchema
  }),
  fabric: fabricEnum.optional(),
  gender: genderEnum,
  price: z.preprocess(
    val => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().positive("Price must be positive")
  ),
  discountType: discountTypeEnum.default("percentage"),
  discountPrice: z.preprocess(
    val => {
      if (val === undefined || val === null || val === "") return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number().positive("Discount price must be positive").optional()
  ),
  quantity: z.preprocess(
    val => {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().int().nonnegative("Quantity must be a positive integer")
  ),
  inStock: z.preprocess(
    val => val === "true" || val === true,
    z.boolean().default(true)
  ),
  soldCount: z.preprocess(
    val => {
      if (val === undefined || val === null || val === "") return 0;
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().int().nonnegative().default(0)
  ),
  thumbnailImage: imageSchema.optional(),
  images: z.array(imageSchema).optional(),
  attributes: z.preprocess(
    val => {
      if (!val) return {};
      if (val instanceof Map) return Object.fromEntries(val.entries());
      if (typeof val === 'string') return safeParseJSON(val) || {};
      return val;
    },
    z.record(z.string()).default({})
  ),
  attributeDefinition: z.preprocess(
    val => val || undefined,
    z.string()
      .refine(val => !val || mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid attribute definition ID"
      })
      .optional()
  )
});

// Main product schema with complete preprocessing
export const createProductBodySchema = z.object({
  productName: z.string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name too long"),
  brandName: z.string()
    .trim()
    .max(50, "Brand name too long")
    .default("cchhaap"),
  category: z.preprocess(
    val => val || undefined,
    z.string()
      .min(1, "Category ID is required")
      .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid category ID format"
      })
  ),
  subCategory: z.preprocess(
    val => {
      if (!val) return [];
      if (typeof val === 'string') return [val];
      if (Array.isArray(val)) return val;
      return Object.values(val);
    },
    z.array(z.string().min(1, "Subcategory cannot be empty"))
      .min(1, "At least one subcategory is required")
  ),
  description: z.string()
    .min(10, "Description too short")
    .max(2000, "Description too long"),
  totalRatingSum: z.preprocess(
    val => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().nonnegative().default(0)
  ),
  totalRatingsCount: z.preprocess(
    val => {
      const num = parseInt(val);
      return isNaN(num) ? 0 : num;
    },
    z.number().int().nonnegative().default(0)
  ),
  isActive: z.preprocess(
    val => val === "true" || val === true,
    z.boolean().default(true)
  ),
  sku: z.string()
    .min(1, "SKU is required")
    .max(50, "SKU too long"),
  variations: z.preprocess(
    val => {
      if (!val) return [];
      if (typeof val === 'string') return safeParseJSON(val) || [];
      if (Array.isArray(val)) return val;
      return Object.values(val);
    },
    z.array(variationSchema)
      .min(1, "At least one variation is required")
  )
});

