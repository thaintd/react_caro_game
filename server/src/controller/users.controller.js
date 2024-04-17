const User = require("../models/user.model");
const user = {
  getOne: async (req, res) => {
    const { userId } = req.params;
    console.log(userId);
    try {
      const users = await User.findOne({ userId });
      res.json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
};
module.exports = user;
