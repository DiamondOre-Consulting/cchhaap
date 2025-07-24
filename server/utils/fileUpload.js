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


export const multipleFileUpload = async (files, folder) => {
  try {
    const groupedUploads = {};

    // Process files in parallel for better performance
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) {
              console.error("Upload error:", error);
              return reject(new Error("Upload failed: " + error.message));
            }
            resolve({
              fieldname: file.fieldname,
              uploadResult: {
                publicId: result.public_id,
                secureUrl: result.secure_url
              }
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    
    // Group the results
    results.forEach(({ fieldname, uploadResult }) => {
      if (!groupedUploads[fieldname]) {
        groupedUploads[fieldname] = [];
      }
      groupedUploads[fieldname].push(uploadResult);
    });

    return groupedUploads;
  } catch (err) {
    console.error("File upload error:", err);
    throw new ApiError("Files not uploaded: " + err.message, 500);
  }
};
