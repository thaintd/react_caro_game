const User = require("../models/user.model");
const Score = {
  getScore: async (req, res) => {
    try {
      const users = await User.find({}, "name score picture");
      res.json({ users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  updatePlayerPoints: async (req, res) => {
    const { userId } = req.params;
    try {
      const player = await User.findOne({ userId });
      if (player) {
        player.score += 1;
        await player.save();
      }
    } catch (err) {
      console.error("Error updating player points:", err);
    }
  }
};

module.exports = Score;
