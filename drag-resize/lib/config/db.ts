import mongoose from "mongoose";

let isConnected = false; // flag global

export const ConnectDB = async () => {
  if (isConnected) {
    // gunakan koneksi yang sudah ada
    return;
  }

  const uri = process.env.MONGODB_URI || "";

  try {
    await mongoose.connect(uri, {
      dbName: "db-test-Grid",
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
