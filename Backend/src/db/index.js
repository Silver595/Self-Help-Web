import mongoose from "mongoose";
import { DB_NAME } from "../constanst.js";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    const connectionInstance = await mongoose.connect(
      uri,
      { dbName: DB_NAME }
    );

    console.log(
      `MongoDB connected: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
