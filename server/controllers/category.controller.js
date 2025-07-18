
import { asyncHandler } from "../utils/asyncHandler.js"
import sendResponse from "../utils/sendResponse.js"
import Category from "../models/category.model.js"
import ApiError from "../utils/apiError.js"
import { fileDestroy, fileUpload } from "../utils/fileUpload.js"





export const getAllCategories = asyncHandler (async(req,res)=>{

     const categories = await Category.find({})
     if (!categories.length) {
         sendResponse(res, 404, null, "No categories found")
      }
      sendResponse(res,200,categories,"Categories found")

})


export const createCategory = asyncHandler(async(req,res)=>{

    const {categoryName } = req.validatedData.body

    const existingCategory = await Category.findOne({ categoryName });
     if (existingCategory) {
         throw new ApiError("Category already exists",400)
     }
     
     const category = await Category.create({categoryName})
     if(req.file){
        const uploadedImage = await fileUpload(req.file.buffer,"categoryImage")

        if(!uploadedImage){ 
            throw new ApiError("Image upload failed",400)
        }

     
        category.categoryImage = uploadedImage
        await category.save()

     }
    
    sendResponse(res,200,category,"Category created")

})


export const editCategory = asyncHandler(async(req,res)=>{
    
    const {categoryId} = req.validatedData.params
    const {categoryName} = req.validatedData.body

    const existingCategory= await Category.findById(categoryId)
    
    if (!existingCategory) {
        throw new ApiError("Category does not exist",404)    
    }
    
    const existingCategoryName= await Category.findOne({categoryName})
    if(existingCategoryName&&(categoryId!==existingCategoryName?._id.toString())){
        throw new ApiError("Category name already exist",404)
    }

    if(req.file){

        if(existingCategory.categoryImage.publicId){
           const res= await fileDestroy(existingCategory.categoryImage.publicId)
        }
        const uploadedImage = await fileUpload(req.file.buffer,"categoryImage")

        if(!uploadedImage){ 
            throw new ApiError("Image upload failed",400)
        }
     
        existingCategory.categoryImage = uploadedImage
        await existingCategory.save()

     }

    
    existingCategory.categoryName = categoryName
    await existingCategory.save()
    sendResponse(res,200,existingCategory,"Category updated")

})


export const deleteCategory = asyncHandler(async(req,res)=>{

    const {categoryId} = req.validatedData.params

    const category = await Category.findById(categoryId)

    

    if(!category){
       throw new ApiError("Category not found",404)
    }

   
    await category.deleteOne()

    // await Product.deleteMany({ category: categoryId });

    sendResponse(res,200,null,"Category deleted")

})


export const createSubCategory = asyncHandler(async(req,res)=>{
    
    const {categoryId} = req.validatedData.params
    const {subCategoryName} = req.validatedData.body

    const existingCategory = await Category.findById(categoryId)

    if(!existingCategory){
        throw new ApiError("Category not found",400)
    }
    if(existingCategory.categoryName===subCategoryName){
        throw new ApiError("Subcategory name cannot be same as category name",400)
    }
    if(existingCategory.subCategories.includes(subCategoryName)){
       throw new ApiError("Subcategory already exists",400)
    }

    const subCategoryExists = await Category.findOne({ subCategories: subCategoryName });
    
    if(subCategoryExists){
        throw new ApiError("Sub category already exist in other category",400)
    }


    existingCategory.subCategories.push(subCategoryName)
    await existingCategory.save()
    sendResponse(res,200,existingCategory,"Subcategory created")

})

export const deleteSubCategory = asyncHandler(async(req,res)=>{

    const {categoryId} = req.validatedData.params
    const {subCategoryName} = req.validatedData.body


    const existingCategory = await Category.findById(categoryId)

    if(!existingCategory){
        throw new ApiError("Category not found",404)
    }

    if(!existingCategory.subCategories.includes(subCategoryName)){
        throw new ApiError("Subcategory not found",404)
    }

    existingCategory.subCategories.pull(subCategoryName)

    await existingCategory.save()

    await Product.updateMany(
        { category: categoryId },
        { $pull: { subCategory: subCategoryName } }
    );

    sendResponse(res,200,existingCategory,"Subcategory deleted")

  
})

export const editSubCategory = asyncHandler(async(req,res)=>{
    const {categoryId} = req.validatedData.params
    const {oldSubCategoryName,newSubCategoryName,indexOfOldCategory} = req.validatedData.body
    

    if(oldSubCategoryName===newSubCategoryName){
        throw new ApiError("New subcategory name must be different from the old name",400)
    }

    const existingCategory = await Category.findById(categoryId)

    if(!existingCategory){
        throw new ApiError("Category not found",400)
    }

    if (indexOfOldCategory < 0 || indexOfOldCategory >= existingCategory.subCategories.length) {
        throw new ApiError("Invalid subcategory index", 400);
    }

    if(existingCategory.categoryName===newSubCategoryName){
        throw new ApiError("Subcategory name cannot be same as category name",400)
    }

    if (existingCategory.subCategories.includes(newSubCategoryName)) {
        throw new ApiError("Subcategory name already exists", 400);
    }

    const subCategoryExists = await Category.findOne({ subCategories: newSubCategoryName });
    
    if(subCategoryExists){
        throw new ApiError("Sub category already exist in other category",400)
    }

    if(existingCategory.subCategories[indexOfOldCategory]!==oldSubCategoryName){
        throw new ApiError("Old subcategory name does not match the given index",400)
    }
    

    existingCategory.subCategories[indexOfOldCategory]=newSubCategoryName
    

    await existingCategory.save()

    sendResponse(res,200,existingCategory,"Subcategory edited")
})


export const getHeaderCategories = asyncHandler(async (req, res) => {
    const categoriesWithProducts = await Category.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products"
            }
        },
        { $match: { "products.0": { $exists: true } } }, 
        { $unwind: "$products" }, 
        { $unwind: "$products.subCategory" }, 
        {
            $group: {
                _id: "$_id",
                categoryName: { $first: "$categoryName" },
                categoryImage: { $first: "$categoryImage" },
                subCategories: { $addToSet: "$products.subCategory" } 
            }
        }
    ]);

    if (categoriesWithProducts.length === 0) {
        throw new ApiError("No categories with products found", 404);
    }

    sendResponse(res, 200, categoriesWithProducts, "Categories found successfully");
});