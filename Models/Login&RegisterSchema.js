const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobileno: Number,
  password: String,
  usertype: String,
});

module.exports = mongoose.model("newuser", UserSchema);
