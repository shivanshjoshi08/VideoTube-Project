import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilepath) => {
    try {
        if (!localFilepath) {
            return null
        }
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilepath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded successfully on cloudinary", response.url);
        // fs.unlinkSync(localFilepath)
        return response;
    }
    catch (error) {
        //remove the locally saved temporary file as the upload failed
        // fs.unlinkSync(localFilepath)
        console.log("Cloudinary upload error:", error);
        return null;
    }
}

export { uploadOnCloudinary }
// cloudinary.v2.uploader.upload()