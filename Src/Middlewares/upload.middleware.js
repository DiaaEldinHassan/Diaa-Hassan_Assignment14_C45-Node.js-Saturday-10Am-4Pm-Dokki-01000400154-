import multer from "multer";
import { resolve } from "path";
import { v4 as uuidv4 } from "uuid";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resolve("Uploads"));
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${uuidv4()}.${ext}`);
  },
});


function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|gif/;
  const isAllowedExt = allowed.test(file.mimetype.toLowerCase());
  if (isAllowedExt) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
});