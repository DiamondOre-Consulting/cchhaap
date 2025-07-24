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





