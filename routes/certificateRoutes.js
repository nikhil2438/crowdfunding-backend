const express = require("express");
const router = express.Router();
const generateCertificate = require("../Certificates/GenerateCertificate");
const fs = require("fs");
const path = require("path");
const { Certificate } = require("crypto");

router.post("/generate-certificate", async (req, res) => {
  const { name, amount } = req.body;

  try {
    const filePath =  await  generateCertificate({ name, amount });

    if (!fs.existsSync(filePath)) {
        console.error("Certificate file not found:", filePath);
        return res.status(500).send("Certificate file not found.");
    }
    

    res.download(filePath, `${name.replace(/ /g, "_")}_Certificate.pdf`, (err) => {
      if (err) {
        console.error("Error sending certificate:", err);
         if (!res.headersSent) {
        res.status(500).send("Could not send certificate");
         }
        
      }
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    if (!res.headersSent) {
    res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

module.exports = router;
