import { asyncHandler } from "../utils/asyncHandler.js"
import { fileDestroy, fileUpload,multipleFileUpload } from "../utils/fileUpload.js"
import Product from "../models/product.model.js"
import sendResponse from "../utils/sendResponse.js"
import ApiError from "../utils/apiError.js"









export const createProduct = asyncHandler(async (req, res) => {
  const {
    productName, 
    brandName,
    category,
    subCategory,
    description,
    sku,
    variations,
  } = req.body;

  console.log(variations)

  // Convert null prototype objects to plain objects
  const parsedVariations = variations.map(variation => ({
    ...variation,
    color: variation.color ? { ...variation.color } : null,
    attributes: variation.attributes ? { ...variation.attributes } : null
  }));
    


  const groupedUploads = await multipleFileUpload(req.files, "products");
    

  const variationWithImages = parsedVariations.map((variation, index) => {
    // Correct field name patterns
    const thumbnailField = `variations[${index}][thumbnailImage]`;
    const imagesField = `variations[${index}][images]`;
    
    const thumbnailImage = groupedUploads[thumbnailField]?.[0] || null;
    const images = groupedUploads[imagesField] || [];

    return {
      ...variation,
      thumbnailImage,
      images,     
    };
  });


  const existingProduct = await Product.findOne({ productName,sku });
  if (existingProduct) {
    throw new ApiError(400, "Product with this name or sku already exists");
  }

  const newProduct = await Product.create({
    productName,
    brandName,
    category,
    subCategory,
    description,
    sku,
    variations: variationWithImages,
  });

  return sendResponse(res, 200, newProduct, "Product created successfully");
});





export const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;


  const product = await Product.findById(productId);
  
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

 
  const imageDeletionPromises = [];


  product.variations.forEach(variation => {
  
    if (variation.thumbnailImage?.publicId) {
      imageDeletionPromises.push(
        fileDestroy(variation.thumbnailImage.publicId)
      );
    }

   
    if (variation.images?.length > 0) {
      variation.images.forEach(image => {
        if (image.publicId) {
          imageDeletionPromises.push(
            fileDestroy(image.publicId)
          );
        }
      });
    }
  });

  await Promise.all(imageDeletionPromises)
    .catch(error => {
      console.error("Error deleting images:", error);

    });


  await Product.findByIdAndDelete(productId);

  return sendResponse(res, 200, null, "Product and all associated images deleted successfully");
});



export const getAdminAllProducts = asyncHandler(async (req, res) => {
     
    const limit = req.validatedData.params.limit || 10;
    const page = req.validatedData.params.page || 1;

    const products = await Product.find({}).populate("category").limit(limit).skip((page-1)*limit).sort({createdAt:-1})


    if (products.length === 0) {
        throw new ApiError("No products found", 404);
    }
    const totalPages = await Product.estimatedDocumentCount()

    sendResponse(res, 200, { products, currentPage: page, totalPages: Math.ceil(totalPages/limit) }, "Products found");

})





export const getAdminSingleProduct = asyncHandler(async(req,res)=>{
     const {productId} = req.validatedData.params

     const product = await Product.findById(productId)
    .populate("category");


     if(!product){
        throw new ApiError("Product not found",400)
    }

  
   
    sendResponse(res,200,product,"Product fetched successfully")

})





export const editProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const {
    productName,
    brandName,
    category,
    subCategory,
    description,
    sku,
    variations,
    isActive
  } = req.body;

  // 1. Find existing product
  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    throw new ApiError(404, "Product not found");
  }

  // 2. Check for duplicate SKU
  if (sku && sku !== existingProduct.sku) {
    const skuExists = await Product.findOne({ sku, _id: { $ne: productId } });
    if (skuExists) {
      throw new ApiError(400, "SKU already exists");
    }
  }
  console.log(req.body)
console.log(req.files)
  // 3. Process file uploads
  const groupedUploads = await multipleFileUpload(req.files, "products");
  const imagesToDelete = [];
  const variationsArray = Array.isArray(variations) ? variations : [];

  // 4. Prepare updated variations
  // Track existing variation IDs for removal detection
  const incomingVariationIds = variationsArray.filter(v => v._id).map(v => v._id.toString());
  const existingVariationIds = existingProduct.variations.map(v => v._id.toString());

  // Find removed variations and schedule their images for deletion
  existingProduct.variations.forEach(existingVar => {
    if (!incomingVariationIds.includes(existingVar._id.toString())) {
      // Remove all images for this variation
      if (existingVar.thumbnailImage?.publicId) {
        imagesToDelete.push(existingVar.thumbnailImage.publicId);
      }
      if (Array.isArray(existingVar.images)) {
        existingVar.images.forEach(image => {
          if (image.publicId) imagesToDelete.push(image.publicId);
        });
      }
    }
  });

  // Build updated variations array
  const updatedVariations = variationsArray.map((variation, index) => {
    let existingVariation = variation._id
      ? existingProduct.variations.id(variation._id)
      : null;
    // Handle thumbnail image
    const thumbnailField = `variations[${index}][thumbnailImage]`;
    let thumbnailImage = existingVariation?.thumbnailImage || null;
    if (groupedUploads[thumbnailField]?.[0]) {
      // Delete old thumbnail if it exists
      if (thumbnailImage?.publicId) {
        imagesToDelete.push(thumbnailImage.publicId);
      }
      thumbnailImage = groupedUploads[thumbnailField][0];
    }
    // Handle images
    const imagesField = `variations[${index}][images]`;
    let updatedImages = [];
    // If images is undefined, keep existing images
    if (variation.images === undefined) {
      updatedImages = existingVariation?.images || [];
    } else {
      const incomingImages = Array.isArray(variation.images) ? variation.images : [];
      const existingImages = existingVariation?.images || [];
      // Remove deleted images
      existingImages.forEach(existingImg => {
        const isImageKept = incomingImages.some(img => img.uniqueId === existingImg.uniqueId);
        if (!isImageKept && existingImg.publicId) {
          imagesToDelete.push(existingImg.publicId);
        }
      });
      // Add/keep images
      if (groupedUploads[imagesField]) {
        updatedImages = incomingImages.map(img => {
          const existingImg = existingImages.find(ei => ei.uniqueId === img.uniqueId);
          const uploadedFile = groupedUploads[imagesField].find(uf => uf.uniqueId === img.uniqueId);
          if (uploadedFile) {
            if (existingImg?.publicId) {
              imagesToDelete.push(existingImg.publicId);
            }
            return {
              ...img,
              publicId: uploadedFile.uploadResult.publicId,
              secureUrl: uploadedFile.uploadResult.secureUrl,
              uniqueId: img.uniqueId
            };
          } else if (existingImg) {
            return existingImg;
          }
          return img;
        }).filter(Boolean);
      } else {
        updatedImages = incomingImages.map(img => {
          return existingImages.find(ei => ei.uniqueId === img.uniqueId) || img;
        });
      }
    }
    // Merge all fields
    return {
      ...(existingVariation ? existingVariation.toObject() : {}),
      ...variation,
      thumbnailImage,
      images: updatedImages
    };
  });

  // 5. Update product data (only update fields present in request)
  const updateData = {};
  if (productName !== undefined) updateData.productName = productName;
  if (brandName !== undefined) updateData.brandName = brandName;
  if (category !== undefined) updateData.category = category;
  if (subCategory !== undefined) updateData.subCategory = subCategory;
  if (description !== undefined) updateData.description = description;
  if (sku !== undefined) updateData.sku = sku;
  if (isActive !== undefined) updateData.isActive = isActive;
  updateData.variations = updatedVariations;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    { new: true, runValidators: true }
  );

  // 6. Clean up old images in background
  console.log( "1", imagesToDelete)
  if (imagesToDelete.length > 0) {
console.log("2" , imagesToDelete)
    Promise.all(imagesToDelete.map(publicId => fileDestroy(publicId)))
      .catch(err => console.error("Error deleting old images:", err));
  }

  return sendResponse(res, 200, updatedProduct, "Product updated successfully");
});




