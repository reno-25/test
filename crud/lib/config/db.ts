import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb://infiniti:changeyourpwd@172.16.100.106:27017/crud?authSource=admin");
    console.log("MongoDB connected");
};
