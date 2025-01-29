// utils/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = async (file) => {
  // Convert file to base64
  const base64Data = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(base64Data, {
    resource_type: "auto"
  });

  return result.secure_url;
};