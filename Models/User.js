const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  FullName: { type: String, required: true, trim: true },
  Email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  MobileNumber: { type: String, required: true, trim: true },
  Password: { type: String, required: true },
  ConfirmPassword: { type: String, required: true },
  usertype: { type: String, enum: ['Admin', 'User'], default: 'User' },
}, {
  timestamps: true,
  collection: 'newusers'  
});

module.exports = mongoose.model('User', UserSchema);
