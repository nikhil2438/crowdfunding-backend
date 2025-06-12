
const express = require("express");
const router = express.Router();
const Fundraiser = require("../Models/Fundraiser");
const sendUserEmail = require("../utils/sendEmail");
const uploadMedia = require("../middleware/uploadMiddleware");

router.post("/fundraisersRegister", (req, res) => {
  uploadMedia.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
  ])(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: "Upload error", error: err });
    }

    const { name, contact, email, cause, amount } = req.body;
    const imageUri = req.files['image']?.[0]?.path || null;
    const videoUri = req.files['video']?.[0]?.path || null;

    try {
      const newFundraiser = new Fundraiser({
        name,
        contact,
        email,
        cause,
        amount,
        status: "pending",
        documentUrl: imageUri,
        videoUrl: videoUri,
      });

      await newFundraiser.save();
      res.status(201).json({ message: "Fundraiser submitted with media.", fundraiser: newFundraiser });
    } catch (error) {
      console.error("Error saving fundraiser:", error);
      res.status(500).json({ message: "Error creating fundraiser", error });
    }
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////

// GET: Retrieve all fundraiser submissions (for admin panel)
router.get("/fundraisers", async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find().sort({ createdAt: -1 }); // most recent first
    res.json(fundraisers);
  } catch (error) {
    console.error("Error fetching fundraisers:", error);
    res.status(500).json({ message: "Error fetching fundraisers", error });
  }
});

// PATCH: routes
router.patch("/fundraisers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const fundraiser = await Fundraiser.findById(id);

    if (!fundraiser) {
      return res.status(404).json({ message: "Fundraiser not found" });
    }

    fundraiser.status = status;
    await fundraiser.save();


    // ✅ Send email to user
    await sendUserEmail(fundraiser.email, fundraiser.name, status);

    res.json({ message: `Fundraiser ${status}`, fundraiser });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error", error });
  
  }
});


  // GET: Retrieve approved fundraisers (for public display)
router.get("/fundraisers/approved", async (req, res) => {
  try {
    const approvedFundraisers = await Fundraiser.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(approvedFundraisers);
  } catch (error) {
    console.error("Error fetching approved fundraisers:", error);
    res.status(500).json({ message: "Error fetching approved fundraisers", error });
  }
});

// Get all approved fundraisers with release status
router.get("/fundraisers/release-status", async (req, res) => {
  try {
    const fundraisers = await Fundraiser.find({ status: "approved" });
    res.json(fundraisers);
  } catch (error) {
    console.error("Error fetching release-status fundraisers:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Step 1: Request fund release (mark isReleaseRequested = true)
router.put("/fundraisers/request-release/:id", async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id);
    if (!fundraiser) return res.status(404).json({ message: "Fundraiser not found" });

    fundraiser.isReleaseRequested = true;
    await fundraiser.save();

    res.json({ message: "Release requested" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Step 2: Admin verifies & releases funds
router.put("/fundraisers/release/:id", async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id);
    if (!fundraiser) return res.status(404).json({ message: "Fundraiser not found" });

    if (!fundraiser.isReleaseRequested)
      return res.status(400).json({ message: "Release not requested yet" });

    fundraiser.isFundsReleased = true;
    fundraiser.isReleaseRequested = false;
    await fundraiser.save();

 // Optional: Send confirmation email here

  // Optional: Send confirmation email here

  
 res.json({ message: "Funds released successfully", fundraiser });
  } catch (error) {
    console.error("Error releasing funds:", error);
    res.status(500).json({ message: "Server error", error });
  }


  // for get
  router.get("/fundraisers/released", async (req, res) => {
  try {
    const releasedFundraisers = await Fundraiser.find({ isFundsReleased: true }).sort({ createdAt: -1 });
    res.json(releasedFundraisers);
  } catch (error) {
    console.error("Error fetching released fundraisers:", error);
    res.status(500).json({ message: "Server error" });
  }
});  
});


module.exports = router;
