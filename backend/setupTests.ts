import request from "supertest";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from "./src/app";

dotenv.config();

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

// afterEach(async () => {
//     if (!mongoose.connection.db) {
//         console.error("No database connection");
//         return;
//     }
//     const collections = await mongoose.connection.db.collections();
//     for (const collection of collections) {
//         await collection.deleteMany({});
//     }
// });