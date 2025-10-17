import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async () => {
  //  Cloudinary Setup
  const CLOUDINARY_NAME = "dstufxn9q";
  const CLOUDINARY_API_KEY = "519771211333221";
  const CLOUDINARY_SECRET_KEY = "vfIIxYe1bx5CmbX27BOqoTohhq8";

  cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY,
  });
};

export default connectCloudinary;
