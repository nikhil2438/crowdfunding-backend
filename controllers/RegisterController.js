const express = require("express");
const RegisterSchema = require("../Models/RegisterLoginSchema");

const RegisterRoutes = async (req, res) => {
  const { FullName, Email, MobileNumber, Password } = req.body;

  try {
    const AllUsers = await RegisterSchema.find();
    let NewUser = null;

    
    const mobileRegex = /^[0-9]{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!MobileNumber || MobileNumber.length !== 10) {
      return res
        .status(400)
        .json({ message: "Mobile number should be exactly 10 digits" });
    } else if (!mobileRegex.test(MobileNumber)) {
      return res.status(400).json({
        message: "Only numeric values are allowed in mobile number",
      });
    }
    if (!emailRegex.test(Email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (AllUsers.length === 0) {
    
      NewUser = await RegisterSchema.create({
        FullName,
        Email,
        MobileNumber,
        Password,
        usertype: "Admin",
      });

      return res.status(201).json({
        message: "Admin created successfully",
        NewUser,
      });
    } else {
      
      const check_phone_email = await RegisterSchema.findOne({
        $or: [{ Email }, { MobileNumber }],
      });

      if (check_phone_email) {
        return res.status(400).json({ message: "User already exists" });
      }

          
      const newUser = await RegisterSchema.create({
        FullName,
        Email,
        MobileNumber,
        Password,
        usertype: "User",
      });

      return res
        .status(201)
        .json({ message: "User Created Successfully", newUser });
    }
  } catch (error) {
    console.log("Something went wrong", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = RegisterRoutes;
