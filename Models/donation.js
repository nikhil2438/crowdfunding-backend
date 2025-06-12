
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  FullName: { type: String, required: true },
  ContactNumber: { type: String, required: true },
  Email: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  Language: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  donation: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Payment",
  },
});

module.exports = mongoose.model("donation", donationSchema);
