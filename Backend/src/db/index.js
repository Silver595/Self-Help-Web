// Contains the database connection logic, typically a function that calls mongoose.connect(...) with your connection string from .env, wrapped in try/catch. It’s kept separate so connection details don’t clutter your server startup code. The main index.js just calls connectDB().
import { env } from '../config/env.js'
import mongoose from "mongoose";
import { DB_NAME } from "../constanst.js";

const connectDB = async () => {
  try {
    const uri = env.MONGODB_URI;
    const connectionInstance = await mongoose.connect(
      uri,
      { dbName: DB_NAME }
    );
    console.log("MongoDB Connected")

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
