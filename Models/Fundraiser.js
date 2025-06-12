const mongoose = require('mongoose');

const fundraiserSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  cause: String,
  amount: Number,
  documentUrl: String,
  videoUrl: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  
 // ✅ Add these for fund release logic
  isReleaseRequested: {
    type: Boolean,
    default: false,
  },
  isFundsReleased: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true });





module.exports = mongoose.model('Fundraiser', fundraiserSchema);
