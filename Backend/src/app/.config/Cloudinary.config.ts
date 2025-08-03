import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import dotenv from "dotenv";
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});
const cloudinaryConfig = cloudinary.config();

export default cloudinaryConfig;
