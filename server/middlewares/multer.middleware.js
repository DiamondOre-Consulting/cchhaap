import multer, { memoryStorage } from "multer"


const imageStorage = multer.memoryStorage()


const allowedMimeTypes = [
  // ✅ Image types
  "image/jpeg",  
  "image/png",   
  "image/gif",   
  "image/webp",  
  "image/tiff",  
  "image/bmp",   
  "image/svg+xml",

  // ✅ Video types
  "video/mp4",
  "video/quicktime",       // .mov
  "video/x-msvideo",       // .avi
  "video/x-matroska",      // .mkv
  "video/webm",
  "video/3gpp",
  "video/3gpp2",
  "video/x-flv",
  "application/x-mpegURL", // .m3u8
  "video/MP2T"             // .ts
];
export const singleImageUpload = multer({
    storage: imageStorage,
    limits :{ fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (!file) return cb(null, true);
        if (!allowedMimeTypes.includes(file.mimetype)) {

            return cb(new Error("Only image and videos files are allowed"));
        }
        cb(null, true);

    }
})

export const multipleImageUpload = multer({
    storage:imageStorage,
    limits : {fileSize: 30 * 1024 *1024},
    fileFilter: (req, file, cb) => {
        if (!file) return cb(null, true);
        // console.log("file mime type",file.mimetype)
        if (!allowedMimeTypes.includes(file.mimetype)) {
          
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    }
})