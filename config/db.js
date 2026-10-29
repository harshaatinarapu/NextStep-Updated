const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();   // loads .env

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nextstep";
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected:", mongoURI.includes("@") ? "Remote Cluster" : mongoURI);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
