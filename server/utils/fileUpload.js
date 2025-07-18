import cloudinary from "cloudinary"
import ApiError from "./apiError.js"

export const fileUpload = async(fileBuffer,folder)=>{
    try{

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                { folder:folder },
                (error, result) => {
                    if (error) return reject(new Error("Upload failed: " + error.message));
                    resolve({ publicId: result.public_id, secureUrl: result.secure_url });
                }
            );
            uploadStream.end(fileBuffer);
        });
    }
    catch (err) {
        throw new ApiError('File can not get uploaded', 500)
    }
}


export const fileDestroy = async (publicId) => {
    try {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(publicId, (error, result) => {
                if (error || result.result !== "ok") {
                    return reject(new ApiError("File deletion failed", 500));
                }
                resolve({ success: true, message: "File deleted successfully" });
            });
        });
    } catch (err) {
        console.log(err)
        throw new ApiError("Error deleting file", 500);
    }
};


export const multipleFileUpload = async (files,folder)=>{
    try{
        const uploadedFiles = [] 

        for(const file of Object.values(files)){
            const uploadResult = await new Promise((resolve,reject)=>{
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { folder },
                    (error, result) => {
                        if (error) return reject(new Error("Upload failed: " + error.message));
                        resolve({ publicId: result.public_id, secureUrl: result.secure_url });
                    }
                );
                uploadStream.end(file.buffer); 
                 })
            uploadedFiles.push(uploadResult)
        }
        return uploadedFiles
    }
    catch(err){
        throw new ApiError('Files not uploaded', 500)
    }

}