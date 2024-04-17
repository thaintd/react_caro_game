const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const login = async ({ id, name, picture }) => {
  try {
    const user = await User.findOne({ userId: id });
    let token = null;
    if (user) {
      token = user && jwt.sign({ userId: user.userId, name: user.name, picture: user.picture }, process.env.JWT_SECRET, { expiresIn: "1h" });
    } else {
      const newUser = new User({ userId: id, name, picture });
      const result = await newUser.save();
      token = jwt.sign({ userId: result.userId, name: result.name, picture: result.picture }, process.env.JWT_SECRET, { expiresIn: "1h" });
    }
    return {
      err: token ? 0 : 1,
      mes: token ? "Login success" : response ? "Password wrong" : "Email not registered",
      access_token: token ? `Bearer ${token}` : token
    };
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  login
};
