import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

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
