const express = require('express');
const router = express.Router();
const Donation = require('../Models/donation');

router.get('/summary', async (req, res) => {
  try {
    const donations = await Donation.find();
    console.log("Donations for summary:");
    donations.forEach(d => {
      // console.log(`${d.FullName} - ₹${d.amount} - ${d.category}`);
    });


    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

    
    const uniqueDonors = new Set(
      donations.map(d => d.FullName.trim().toLowerCase())
    );

    const categoryTotals = donations.reduce((acc, donation) => {
      const category = donation.category || 'Uncategorized';
      if (!acc[category]) acc[category] = 0;
      acc[category] += donation.amount;
      return acc;
    }, {});

    res.json({
      totalAmount,
      totalDonors: uniqueDonors.size,
      categoryTotals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
 
