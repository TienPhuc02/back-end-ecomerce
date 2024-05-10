import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.CLOUDINARY_CLOUD_NAME);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = (file) => {
  cloudinary.v2.uploader.upload(file, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error",
      });
    }
    return result;
  });
};

export const delete_file = async (file) => {
  const res = await cloudinary.v2.uploader.destroy(file);

  if (res?.result === "ok") return true;
};
