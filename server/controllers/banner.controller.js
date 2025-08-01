import { asyncHandler } from "../utils/asyncHandler.js"
import sendResponse from "../utils/sendResponse.js"
import Banner from "../models/banner.model.js"
import ApiError from "../utils/apiError.js"
import { fileDestroy, fileUpload, multipleFileUpload } from "../utils/fileUpload.js"











export const addBannerImage = asyncHandler(async (req, res) => {
    const files = req.files;
    console.log(files)
    console.log(req.body.bannerImages)
    const inputImages = JSON.parse(req.body.bannerImages); // Array of { secureUrl, publicId, uniqueId }

    if (!files || !inputImages || inputImages.length === 0) {
        throw new ApiError("No files or metadata received", 400);
    }

    // Match each file to its uniqueId (from filename)
    const matchedFiles = inputImages.map(data => {
        const file = files.find(f => f.originalname.startsWith(data.uniqueId));
        if (!file) throw new ApiError(`File not found for uniqueId: ${data.uniqueId}`, 400);
        return { file, uniqueId: data.uniqueId };
    });

    console.log("files",matchedFiles)

    // return sendResponse(res,200,null,"testing")

    // Upload all files
    const uploadResults = await Promise.all(
        matchedFiles.map(async ({ file, uniqueId }) => {
            const uploaded = await fileUpload(file.buffer, "bannerImage");
            return {
                secureUrl: uploaded.secureUrl,
                publicId: uploaded.publicId,
                uniqueId
            };
        })
    );

    // Save to DB
    const existingBanner = await Banner.findOne();

    if (!existingBanner) {
    await Banner.create({ bannerImage: uploadResults });
    } else {
    await Banner.updateOne(
        { _id: existingBanner._id },
        { $push: { bannerImage: { $each: uploadResults } } }
    );
    }

    sendResponse(res, 200, null, "Banner images added");
});


export const getAllBanners = asyncHandler(async (req, res) => {
    const banner = await Banner.find();
    if (!banner || banner.length === 0) {
        throw new ApiError("No banners found", 404);
    }
    sendResponse(res, 200, banner, "Banner images fetched");
});


export const editBannerImages = asyncHandler(async (req, res) => {
    const inputImages = JSON.parse(req.body.bannerImages);
 
    const uploadedImages = req.files?.length
        ? await multipleFileUpload(req.files, "bannerImage")
        : [];

        console.log("uploadedImages",uploadedImages)

    const existingBanner = await Banner.findOne();
    if (!existingBanner) throw new ApiError("No banner found", 404);

    const bannerList = existingBanner.bannerImage || [];



    
    inputImages.forEach((img) => {
       
        const existing = bannerList.find(b => b.uniqueId === img.uniqueId);
        const uploaded = uploadedImages.bannerImages.find(f => f.uniqueId === img.uniqueId);

     

        if (!existing && uploaded) {
          
            bannerList.push({
                uniqueId: img.uniqueId,
                secureUrl: uploaded.secureUrl,
                publicId: uploaded.publicId
            });
        } else if (existing && uploaded) {
         
            if (existing.publicId) {
                fileDestroy(existing.publicId); 
            }
            existing.secureUrl = uploaded.secureUrl;
            existing.publicId = uploaded.publicId;
        }
    
    });

  
    const updatedBannerList = bannerList.filter((bannerImg) => {
        const stillExists = inputImages.some(img => img.uniqueId === bannerImg.uniqueId);
        if (!stillExists && bannerImg.publicId) {
            fileDestroy(bannerImg.publicId);
        }
        return stillExists;
    });

  
    existingBanner.bannerImage = updatedBannerList;
    await existingBanner.save();

    console.log("existingBanner",existingBanner)

    sendResponse(res, 200, null, "Banner images synced");
});



