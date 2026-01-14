import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadonCloudinary = async (localFilePath) => {

  try {
    if (!localFilePath) return null;

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Debugging: Check if variables are actually being read
    // (View these in your Render Logs after deploying)
    console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("API Key exists?", !!process.env.CLOUDINARY_API_KEY);
    console.log("API Secret exists?", !!process.env.CLOUDINARY_API_SECRET);

    const response = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: 'image',
        folder: "habitFlow/avatars"
      }
    )
    fs.unlinkSync(localFilePath);

    console.log(`File uploaded Successfully! ${response.url}`);
    console.log(response)
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
}

export default uploadonCloudinary;