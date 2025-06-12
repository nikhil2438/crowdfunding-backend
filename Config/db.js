const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URI, {
      
   });
    console.log("MongoDB connected Successfully");
  } catch (error) {
    console.error("MongoDB connection Error:", error.message);
  }
};

module.exports = connectDB;
