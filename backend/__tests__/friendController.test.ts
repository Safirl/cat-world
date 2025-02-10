import request from "supertest";
import { app } from "../src/app";
import Friend from "../src/models/Friend";
import User from "../src/models/User";
import mongoose from "mongoose";

beforeAll(async () => {
    if (!mongoose.connection.db) {
        console.error("No database connection");
        return;
    }
    const collection = await mongoose.connection.db.collection("users");

    await collection.deleteMany({});
    await createUser({ username: "Alice", email: "alice@example.com", password: "password" });
    await createUser({ username: "Bob", email: "bob@example.com", password: "password" });
    await createUser({ username: "Charlie", email: "charlie@example.com", password: "password" });
})

const createUser = async (userData: { username: string, email: string, password: string }) => {
    const response = await request(app)
            .post("/api/auth/register")
            .send(userData);
};

describe("Add friend", () => {
    it("should add a friend for a user", async () => {
    });
});

describe("Remove friend", () => {
    it("should remove a friend for a user", async () => {
    });
});

describe("Fetch friends", () => {
    it("should fetch all friends for a user", async () => {
    });

    it("should fetch friends with the most exchanges", async () => {

    });

    it("should display a friend information", async () => {

    });
});
