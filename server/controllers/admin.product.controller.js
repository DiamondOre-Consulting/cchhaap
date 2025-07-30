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

  console.log(variations[0])
console.log(req.files)

  // Convert null prototype objects to plain objects
  const parsedVariations = variations.map(variation => ({
    ...variation,
    color: variation.color ? { ...variation.color } : null,
    attributes: variation.attributes ? { ...variation.attributes } : null
  }));
    


  const groupedUploads = await multipleFileUpload(req.files, "products");

  console.log("groupedUploads",groupedUploads)
    

  const variationWithImages = parsedVariations.map((variation, index) => {
    // Correct field name patterns
    const thumbnailField = `variations[${index}][thumbnailImage][file]`;
    const imagesField = `variations[${index}][images]`;
    
    const thumbnailImage = groupedUploads[thumbnailField]?.[0] || null;
    const images = groupedUploads[imagesField] || [];

    console.log("thumbnailImage",thumbnailImage)
    console.log("image",images)

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

console.log(products[0].variations[0])
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

  // 3. Process file uploads
  const groupedUploads = await multipleFileUpload(req.files, "products");
  // console.log("req.files",req.files)
  // console.log(req.body.variations[0])
  // console.log(req.body.variations[1])
  // console.log("groupedUploads",groupedUploads)
  const imagesToDelete = [];
  const variationsArray = Array.isArray(variations) ? variations : [];

  // 4. Prepare updated variations
  const updatedVariations = variationsArray.map((variation, index) => {
    console.log("data",variation)
    let existingVariation = variation._id
      ? existingProduct.variations.id(variation._id)
      : null;

    // --- Handle thumbnail image ---
    const thumbnailField = `variations[${index}][thumbnailImage]`;
    let thumbnailImage = existingVariation?.thumbnailImage || null;
    // console.log("variation.thumbnailImage",existingVariation)
    console.log("variation.images",variation.thumbnailImage)
    // console.log(existingVariation)
    // console.log(thumbnailImage)
    
    // Check if new thumbnail file is uploaded
    if (groupedUploads[thumbnailField]?.[0]) {
      // New thumbnail uploaded: delete old if exists, use new
      console.log(7)
      // console.log("thumb",thumbnailImage)
      if (thumbnailImage?.publicId) {
        imagesToDelete.push(thumbnailImage.publicId);
         console.log(8)
      }
      thumbnailImage = groupedUploads[thumbnailField][0];
       console.log(9)
    } else {
      // No new file uploaded, check if thumbnail should be preserved or removed
      if (variation.thumbnailImage.uniqueId==="") {
        // Explicitly set to null - remove thumbnail
        console.log(1)
        if (thumbnailImage?.publicId) {
          imagesToDelete.push(thumbnailImage.publicId);
            console.log(2)
        }
          console.log(3)
        thumbnailImage = null;
      } else if (variation.thumbnailImage && variation.thumbnailImage.publicId) {
        // Keep existing thumbnail if it's still referenced
          console.log(4)
        thumbnailImage = variation.thumbnailImage;
          console.log(5)
      }
      // If variation.thumbnailImage is undefined, preserve existing thumbnail
    }

    // --- Handle images array ---
    const imagesField = `variations[${index}][images]`;
    const existingImages = existingVariation?.images || [];
    const uploadedImages = (groupedUploads[imagesField] || []).reduce((acc, img) => {
      acc[img.uniqueId] = img.uploadResult || img;
      return acc;
    }, {});

    // Get incoming images from request body
    const incomingImages = Array.isArray(variation.images) ? variation.images : [];
    
    // Create maps for efficient lookup
    const existingImagesMap = existingImages.reduce((acc, img) => {
      if (img.uniqueId) {
        acc[img.uniqueId] = img;
      }
      return acc;
    }, {});

    const incomingUniqueIds = incomingImages.map(img => img.uniqueId).filter(Boolean);
    
    // 1. Delete images that are in existing but not in incoming
    existingImages.forEach(img => {
      if (img.uniqueId && !incomingUniqueIds.includes(img.uniqueId) && img.publicId) {
        imagesToDelete.push(img.publicId);
      }
    });

    // 2. Build updated images array
    const updatedImages = incomingImages.map(img => {
      // Case 1: New upload with matching uniqueId
      if (uploadedImages[img.uniqueId]) {
        // Delete old image if it exists
        if (existingImagesMap[img.uniqueId]?.publicId) {
          imagesToDelete.push(existingImagesMap[img.uniqueId].publicId);
        }
        return {
          ...img,
          publicId: uploadedImages[img.uniqueId].publicId,
          secureUrl: uploadedImages[img.uniqueId].secureUrl,
          uniqueId: img.uniqueId
        };
      }
      
      // Case 2: Keep existing image with matching uniqueId
      if (existingImagesMap[img.uniqueId]) {
        return existingImagesMap[img.uniqueId];
      }
      
      // Case 3: New reference (already uploaded) with uniqueId
      if (img.publicId && img.secureUrl && img.uniqueId) {
        return img;
      }
      
      // Case 4: New reference without uniqueId (legacy or new upload)
      if (img.publicId && img.secureUrl && !img.uniqueId) {
        return img;
      }
      
      // Case 5: Invalid image data, skip
      return null;
    }).filter(Boolean);

    // --- Merge all fields ---
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
  if (imagesToDelete.length > 0) {
    Promise.all(imagesToDelete.map(publicId => fileDestroy(publicId)))
      .catch(err => console.error("Error deleting old images:", err));
  }

  return sendResponse(res, 200, updatedProduct, "Product updated successfully");
});




