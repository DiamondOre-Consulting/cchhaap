
import { asyncHandler } from "../utils/asyncHandler";

import Product from "../models/product.model";
import sendResponse from "../utils/sendResponse";
import ApiError from "../utils/apiError";




export const searchProduct = asyncHandler(async(req,res)=>{
    
        const {searchTerm} = req.validatedData.query;


        const products = await Product.aggregate([
             {
                    $search:{
                        index: "products_search_index",
                        text:{
                        query: searchTerm, 
                        path: "productName",    
                        fuzzy: { maxEdits: 2 } 
                        }
             }},
             

            {
                    $addFields: { score: { $meta: "textScore" }} 
            },
            { $limit: 8 },   
            
            {
                $sort: { score: -1, _id: 1 }
            },
            {
                $project: {
                    productName: 1,
                    thumbnailImage: 1,
                    _id: 1
                }
            }
        ])


        if(!products){
            throw new ApiError("No products found",400)
        }


        sendResponse(res,200,products.slice(0,10),"Products found")

       
})
