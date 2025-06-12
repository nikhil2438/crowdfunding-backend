 const donation = require("../Models/donation");
const generateCertificate = require("../Certificates/generateCertificate");
 const registerDonation = async (req, res) => {
  console.log("Received donation data:", req.body);
   const  data  = req.body;

   if (!data.amount || data.amount <= 250) {
     return res.status(400).json({
       error: "Amount should be more than 250.",
    });
  }

   try {
    await donation.create({
       FullName: data.FullName,
       ContactNumber: data.ContactNumber,
       Email: data.Email,
       address: data.address,
      category: data.category,
       Language: data.Language,
       amount: data.amount,
     });

     generateCertificate({
      name: data.FullName,
      amount: data.amount,
     })

     res.status(201).json({ message: "Donation submitted successfully." });
   } catch (error) {
     res.status(500).json({ error: "Server error", details: error.message });
   } };

 module.exports = {
 registerDonation,
 };
