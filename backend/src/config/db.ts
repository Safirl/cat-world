import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(
      (process.env.SCALINGO_MONGO_URL as string) ||
        (process.env.MONGO_URI as string)
    );
  } catch (error) {
    console.error("Erreur de connexion à MongoDB", error);
    process.exit(1);
  }
};

export { connectDB };
