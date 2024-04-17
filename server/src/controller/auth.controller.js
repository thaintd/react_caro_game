const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const authServicer = require("../service/auth");
require("dotenv").config();

const authController = {
  loginWithFacebook: async (req, res) => {
    const { id, name, picture } = req.body;
    try {
      const data = await authServicer.login({ id, name, picture });
      return res.json({ data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  loginWithGoogle: async (req, res) => {
    const { id, family_name, picture } = req.body;
    try {
      const data = await authServicer.login({ id, family_name, picture });
      return res.json({ data });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = authController;
