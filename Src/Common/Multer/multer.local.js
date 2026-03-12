import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { resolve } from "path";  // ← add this
import fs from "fs";

const uploadsDir = resolve("Uploads");


if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);  
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

export const localFileUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});