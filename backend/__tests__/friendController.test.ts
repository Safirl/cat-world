import request from "supertest";
import { app } from "../src/app";
import Friend from "../src/models/Friend";
import User, { IUser } from "../src/models/User";
import mongoose from "mongoose";

let user: IUser;
let friend: IUser;
let friend1: IUser;
beforeAll(async () => {
    if (!mongoose.connection.db) {
        console.error("No database connection");
        return;
    }
    const collection = await mongoose.connection.db.collection("users");

    await collection.deleteMany({});
    user = await User.create({ username: "Alice", email: "alice@example.com", password: "password", color: "red" });
    friend = await User.create({ username: "Bob", email: "bob@example.com", password: "password", color: "red" });
    friend1 = await User.create({ username: "Charlie", email: "charlie@example.com", password: "password", color: "red" });
})

describe("Add friend", () => {
    it("should add a friend for a user", async () => {
        const user_id = user._id;
        const friend_id = friend._id;
        const response = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id, friend_id });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Friendship added");

        const friendsInDb = await Friend.findOne({ user_id, friend_id });
        expect(friendsInDb).toBeTruthy();
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
