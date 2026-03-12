
import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedFiles = ["image/jpg", "image/png", "image/jpeg"];
  if (allowedFiles.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

export const cloudFileUpload = ({ size = 3 }) => {
  const storage = multer.memoryStorage();
  return multer({
    fileFilter,
    storage,
    limits: { fileSize: size * 1024 * 1024 },
  });
};
