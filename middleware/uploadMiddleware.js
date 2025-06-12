const multer = require("multer");
const { storage } = require("../utils/cloudinaryConfig");

const uploadMedia = multer({ storage });

module.exports = uploadMedia;
