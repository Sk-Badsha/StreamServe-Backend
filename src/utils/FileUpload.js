import { v2 as cloudinary } from "cloudinary";
// to read write or open mainly to male any operation on file. it is build-in with express
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    // upload on cloudinary

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log(
      "file successfully uploaded on cloudinary: RESPONSE: ",
      response.url
    );
    fs.unlinkSync(localFilePath);

    return response;
    //some task to be done
  } catch (error) {
    // remove the locally stored temporary file as the upload operation got failed
    console.log(error);

    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
