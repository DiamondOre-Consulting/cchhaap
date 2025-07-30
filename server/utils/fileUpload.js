  import cloudinary from "cloudinary";
  import ApiError from "./apiError.js";

  // Upload a single file (image/video)
  export const fileUpload = async (fileBuffer, folder) => {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { folder, resource_type: "auto" }, // ✅ supports video & image
          (error, result) => {
            if (error) return reject(new Error("Upload failed: " + error.message));
            resolve({ publicId: result.public_id, secureUrl: result.secure_url });
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (err) {
      throw new ApiError("File can not get uploaded", 500);
    }
  };

  // Delete a file by publicId
  export const fileDestroy = async (publicId, strict = false) => {
    try {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.destroy(
          publicId,
          { resource_type: "image" }, // Use 'image' for image deletions
          (error, result) => {
            if (error || result.result !== "ok") {
              console.error("Cloudinary deletion error:", error, result);
              if (strict) {
                return reject(new ApiError("File deletion failed", 500));
              } else {
                // Non-strict: log and resolve
                return resolve({ success: false, message: "File deletion failed", error, result });
              }
            }
            resolve({ success: true, message: "File deleted successfully" });
          }
        );
      });
    } catch (err) {
      console.log(err);
      if (strict) throw new ApiError("Error deleting file", 500);
      return { success: false, message: "Error deleting file", error: err };
    }
  };

  // Upload multiple files (image/video), grouped by fieldname
  export const multipleFileUpload = async (files, folder) => {
    try {
      const groupedUploads = {};

      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder, resource_type: "auto" }, // ✅ auto detects type
            (error, result) => {
              if (error) {
                console.error("Upload error:", error);
                return reject(new Error("Upload failed: " + error.message));
              }

              const fileNameWithExtension = file.originalname;
              const fileName = fileNameWithExtension.split(".").slice(0, -1).join(".");

              // console.log(fileName)

              resolve({
                fieldname: file.fieldname,
                uniqueId: fileName,
                uploadResult: {
                  publicId: result.public_id,
                  secureUrl: result.secure_url,
                },
              });
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      results.forEach(({ fieldname, uniqueId, uploadResult }) => {
            if (!groupedUploads[fieldname]) {
              groupedUploads[fieldname] = [];
            }
            groupedUploads[fieldname].push({ uniqueId, ...uploadResult }); // Include uniqueId
      });

      return groupedUploads;
    } catch (err) {
      console.error("File upload error:", err);
      throw new ApiError("Files not uploaded: " + err.message, 500);
    }
  };
