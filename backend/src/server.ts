import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";
import { connectCloudinary } from "./config/cloudinaryConfig.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectCloudinary()
  .then(() => {
    console.log("Connected to Cloudinary");
  })
  .catch((err: any) => {
    console.error(err);
  });

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: any) => {
    console.error(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
