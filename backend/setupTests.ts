import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User, { IUser } from "./src/models/User.js";
import bcrypt from "bcrypt";

dotenv.config();

export let authToken: string;
export let userTest: IUser;
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
});

beforeEach(async () => {
  if (!mongoose.connection.db) {
    console.error("No database connection");
    return;
  }
  const hashedPassword = await bcrypt.hash("password", 10);
  const userStruct = {
    username: "toto",
    email: "email@toto.com",
    password: hashedPassword,
  };
  userTest = await User.create(userStruct);
  authToken = jwt.sign({ _id: userTest._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  if (!mongoose.connection.db) {
    console.error("No database connection");
    return;
  }
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
