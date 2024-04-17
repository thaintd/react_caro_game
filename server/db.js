const mongoose = require("mongoose");
require("dotenv").config();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to db successfully");
  } catch (error) {
    console.log("Fail to connect db" + error);
  }
};

module.exports = connectMongoDB;
