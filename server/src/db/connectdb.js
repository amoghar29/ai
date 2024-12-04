import mongoose from "mongoose";
import { config } from "dotenv";

config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected :- ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error.message);
    process.exit(1);
  }
};
