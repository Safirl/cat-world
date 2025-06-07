import mongoose from "mongoose";
import User from "../models/User.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Friend from "../models/Friend.js";
import UserLetter from "../models/UserLetter.js";
import Letter from "../models/Letter.js";

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("Seeding users...");
    await seedUsers();

    console.log("Seeding friend relations...");
    await seedFriends();

    console.log("Seeding letters...");
    await seedLetters();

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI as string);

  const existingAdmin = await User.findOne({ isAdmin: true });
  if (!existingAdmin) {
    const adminCredentials = {
      username: "admin",
      email: "admin@email.com",
      password: "password",
      color: "cat_texture_black.webp",
      isAdmin: true,
    };
    const hashedPassword = await bcrypt.hash(adminCredentials.password, 10);
    adminCredentials.password = hashedPassword;
    const adminUser = await User.create(adminCredentials);
    console.log("created admin: ", adminUser);
  } else {
    console.warn("admin is already present in db, skipping: ", existingAdmin);
  }

  const existingUser = await User.findOne({ isAdmin: false });
  if (!existingUser) {
    const userCredentials = {
      username: "user",
      email: "user@email.com",
      password: "password",
      color: "cat_texture_white_bleu.webp",
      isAdmin: false,
    };
    const hashedPassword = await bcrypt.hash(userCredentials.password, 10);
    userCredentials.password = hashedPassword;
    const user = await User.create(userCredentials);
    console.log("created user: ", user);
  } else {
    console.warn("user is already present in db, skipping: ", existingUser);
  }
}

async function seedFriends() {
  const existingUser = await User.findOne({ isAdmin: false });
  const existingAdmin = await User.findOne({ isAdmin: true });
  if (!existingAdmin || !existingUser) {
    throw new Error(
      "Error when adding friend relation: Admin or user inexistant"
    );
  }
  const existingRelation = await Friend.findOne({
    $or: [
      {
        user_id_1: existingUser._id,
        user_id_2: existingAdmin._id,
      },
      {
        user_id_2: existingUser._id,
        user_id_1: existingAdmin._id,
      },
    ],
  });
  if (!existingRelation) {
    const relationCreditential = {
      user_id_1: existingAdmin._id,
      user_id_2: existingUser._id,
    };
    const relation = await Friend.create(relationCreditential);
    console.log("created relation: ", relation);
  } else {
    console.warn(
      "friend relation is already present in db, skipping: ",
      existingRelation
    );
  }
}

async function seedLetters() {
  const existingUser = await User.findOne({ isAdmin: false });
  const existingAdmin = await User.findOne({ isAdmin: true });
  if (!existingAdmin || !existingUser) {
    throw new Error(
      "Error when adding letter: Admin or user inexistant"
    );
  }
  const existingLetterRelation = await UserLetter.findOne({
    $or: [
      {
        sender_id: existingUser._id,
        receiver_id: existingAdmin._id,
      },
      {
        receiver_id: existingUser._id,
        sender_id: existingAdmin._id,
      },
    ],
  });

  if (!existingLetterRelation) {
    const letterCreditential = {
      title: "title",
      content: "content",
      stamp: "stamp1.svg",
    }
    const letter = await Letter.create(letterCreditential);

    console.log("created letter: ", letter);
    const userLetter = await UserLetter.create({ letter_id: letter._id, receiver_id: existingUser._id, sender_id: existingAdmin._id });
    console.log("created userLetter: ", userLetter);
  } else {
    console.warn(
      "letter relation is already present in db, skipping: ",
      existingLetterRelation
    );
  }
}

seedDatabase();
