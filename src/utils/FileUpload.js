import cloudinary from "cloudinary";
// to read write or open mainly to male any operation on file. it is build-in with express
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localPath) return null;
    // upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      "file successfully uploaded on cloudinary: RESPONSE: ",
      response.url
    );
    return response;
  } catch (error) {
    // remove the locally stored temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};
