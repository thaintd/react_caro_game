const User = require("../models/user.model");

async function updatePlayerPoints(userId) {
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

module.exports = {
  updatePlayerPoints
};
