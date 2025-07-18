import multer, { memoryStorage } from "multer"


const imageStorage = multer.memoryStorage()


const allowedImageMimeTypes = [
    "image/jpeg",  
    "image/png",   
    "image/gif",   
    "image/webp",  
    "image/tiff",  
    "image/bmp",   
    "image/svg+xml", 
  ];

export const singleImageUpload = multer({
    storage: imageStorage,
    limits :{ fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if (!file) return cb(null, true);
        if (!allowedImageMimeTypes.includes(file.mimetype)) {

            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);

    }
})

export const multipleImageUpload = multer({
    storage:imageStorage,
    limits : {fileSize: 30 * 1024 *1024},
    fileFilter: (req, file, cb) => {
        if (!file) return cb(null, true);
        if (!allowedImageMimeTypes.includes(file.mimetype)) {
          
            return cb(new Error("Only image files are allowed"));
        }
        cb(null, true);
    }
})