import request from "supertest";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { app } from "./src/app";
import jwt from 'jsonwebtoken'

dotenv.config();

export let authToken: string;
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
    authToken = jwt.sign({ userId: 1 }, process.env.JWT_SECRET!, { expiresIn: "7d" });
});

afterAll(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
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