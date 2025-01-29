const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileUrl) => {
  try {
    const result = await cloudinary.uploader.upload(fileUrl, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error("Cloudinary Upload Failed: " + error.message);
  }
};

module.exports = { uploadToCloudinary };
