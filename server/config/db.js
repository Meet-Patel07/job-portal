import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://meetpatel0709:1234567890@cluster0.5pux0yp.mongodb.net/job-portal";
    console.log("Connecting to:", uri);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

export default connectDB;
