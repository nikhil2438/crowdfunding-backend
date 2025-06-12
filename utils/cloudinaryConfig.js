
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:  process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event_images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff", "ico", "svg" ],
  },
});


const storageImageVideo = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");
    return {
      folder: isVideo ? "FundraiserVideos" : "FundraiserImages",
      resource_type: isVideo ? "video" : "image",
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

module.exports = { cloudinary, storage, storageImageVideo };
 

