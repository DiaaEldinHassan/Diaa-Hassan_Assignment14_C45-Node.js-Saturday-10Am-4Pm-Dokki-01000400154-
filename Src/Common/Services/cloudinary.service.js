import { cloudinary } from "../index.js";
export const uploadToCloudinary = (buffer,id) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `users/${id}/profile`, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer); 
  });
};

export const deleteFromCloudinary = async (id) => {
    console.log(id)
  if (!id) return;
  await cloudinary.uploader.destroy(id);
};