const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  picture: String,
  type: String,
  score: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("User", userSchema);
