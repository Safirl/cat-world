import request from "supertest";
import { app } from "../src/app";
import Friend from "../src/models/Friend";
import User, { IUser } from "../src/models/User";
import mongoose from "mongoose";
import { authToken } from "../setupTests";

let user: IUser;
let friend: IUser;
let friend1: IUser;
beforeAll(async () => {
    if (!mongoose.connection.db) {
        console.error("No database connection");
        return;
    }
    const friends = await mongoose.connection.db.collection("friend");
    const users = await mongoose.connection.db.collection("users");

    await users.deleteMany({});
    await friends.deleteMany({});
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
            .send({ user_id, friend_id })
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Friendship added");
        const friendId = response.body.friend._id;

        const friendInDb = await Friend.findById(friendId);
        expect(friendInDb).toBeTruthy();
    });
});

describe("Remove friend", () => {
    it("should remove a friend for a user", async () => {
        const user_id = user._id;
        const friend_id = friend._id;
        const friendResponse = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id, friend_id })
            .set("Cookie", `token=${authToken}`)

        expect(friendResponse.status).toBe(201);
        expect(friendResponse.body.message).toBe("Friendship added");

        const friendId = friendResponse.body.friend._id;
        // Vérification que le friend est bien créé
        const friendInDb = await Friend.findById(friendId);
        expect(friendInDb).toBeTruthy();

        const deleteResponse = await request(app)
            .delete(`/api/friend/delete/${friendId}`)
            .set("Cookie", `token=${authToken}`)

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Friend deleted successfully");

        // Vérification que le friend n'existe plus
        const deletedFriend = await User.findById(friendId);

        expect(deletedFriend).toBeFalsy();
    });
});

describe("Fetch friends", () => {
    it("should fetch all friends for a user", async () => {
        const user_id = user._id;
        let friend_id = friend._id;
        const friendResponse = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id, friend_id })
            .set("Cookie", `token=${authToken}`)

        expect(friendResponse.status).toBe(201);
        expect(friendResponse.body.message).toBe("Friendship added");

        friend_id = friend1._id
        const friendResponse1 = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id, friend_id })
            .set("Cookie", `token=${authToken}`);

        expect(friendResponse1.status).toBe(201);
        expect(friendResponse1.body.message).toBe("Friendship added");

        const response = await request(app)
            .get(`/api/friend/fetchAll/${user_id}`)
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("All friend found");
    });

    // it("should fetch friends with the most exchanges", async () => {

    // });

    it("should display a friend information", async () => {
        const user_id = user._id;
        const friend_id = friend._id;
        const friendResponse = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id, friend_id })
            .set("Cookie", `token=${authToken}`);

        expect(friendResponse.status).toBe(201);
        expect(friendResponse.body.message).toBe("Friendship added");

        const informationFriendResponse = await request(app)
            .get("/api/friend/showfriend/:id")
            .send({ user_id, friend_id })
            .set("Cookie", `token=${authToken}`);

        expect(informationFriendResponse.status).toBe(201);
        expect(informationFriendResponse.body.message).toBe("Friend information show");
    });
});
