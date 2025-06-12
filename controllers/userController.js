const User = require("../Models/User");

const getUserProfile = async (req, res) => {
  try {
    
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ Email: new RegExp(`^${email}$`, 'i') })
      .select("-Password -ConfirmPassword -__v -createdAt -updatedAt"); 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getUserProfile };
