// Contains the database connection logic, typically a function that calls mongoose.connect(...) with your connection string from .env, wrapped in try/catch. It’s kept separate so connection details don’t clutter your server startup code. The main index.js just calls connectDB().

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
      `MongoDB connected: ${connectionInstance.connection.host}` //if you dont need then remove it
     );

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
