

const LoginSchema = require("../Models/RegisterLoginSchema");

const LoginRoutes = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    const user = await LoginSchema.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (Password === user.Password) {
      console.log("User login successfully", user.usertype);

      
      const userData = user.toObject();

    
      delete userData.Password;
      delete userData.__v;

      return res.status(200).json({
        message: "User login successfully",
        user: userData,
      });
    } else {
      console.log("Incorrect password");
      return res.status(401).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = LoginRoutes;
