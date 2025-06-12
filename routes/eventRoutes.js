const express = require("express");
const router = express.Router();

const { createEvent, getAllEvents } = require("../controllers/EventController");
const multer = require("multer");
const { storage } = require("../utils/cloudinaryConfig"); 

const upload = multer({ storage });

// Apply multer middleware here to handle the 'image' upload before createEvent controller
router.post("/", upload.single("image"), createEvent);

router.get("/", getAllEvents);

module.exports = router;
 
