import mongoose from "mongoose";
import dotenv from "dotenv";
import { ConfigEnvironment } from "./env";
import { logger } from "~/utils/logger";

dotenv.config();

const MONGO_URI = `${ConfigEnvironment.mongoUri}/${ConfigEnvironment.mongoDbName}`;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};
