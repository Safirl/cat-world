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
        const user1 = {
            username: "Friend",
            email: "test@friend.com",
            password: "password"
        };
        const friend1 = await User.create(user1);

        const user2 = {
            username: "Friend2",
            email: "test@friend2.com",
            password: "password"
        };
        const friend2 = await User.create(user2);
        const user_id_1 = friend1._id;
        const user_id_2 = friend2._id;
        const friendResponse = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id_1, user_id_2 });
            
        expect(friendResponse.status).toBe(201);
        expect(friendResponse.body.message).toBe("Friendship added");
        
        const friendsInDb = await Friend.findOne();
        expect(friendsInDb).toBeTruthy();
    });
});

describe("Remove friend", () => {
    it("should remove a friend for a user", async () => {
        const user1 = {
            username: "Friend",
            email: "test@friend.com",
            password: "password"
        };
        const friend1 = await User.create(user1);

        const user2 = {
            username: "Friend2",
            email: "test@friend2.com",
            password: "password"
        };
        const friend2 = await User.create(user2);
        const user_id_1 = friend1._id;
        const user_id_2 = friend2._id;
        const friendResponse = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id_1, user_id_2 });
        

        expect(friendResponse.status).toBe(201);
        expect(friendResponse.body.message).toBe("Friendship added");

        const friendId = friendResponse.body.friend._id;
        // Vérification que la lettre est bien créée
        const friendInDb = await Friend.findById(friendId);
        expect(friendInDb).toBeTruthy();

        const deleteResponse = await request(app)
            .delete(`/api/friend/delete/${friendId}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Friend deleted successfully");

        // Vérification que la lettre et UserLetter ont été supprimées
        const deletedUser = await User.findById(friendId);

        expect(deletedUser).toBeFalsy();


    });
});

describe("Fetch friends", () => {
    it("should fetch all friends for a user", async () => {
        const user1 = {
            username: "Friend",
            email: "test@friend.com",
            password: "password"
        };
        const friend1 = await User.create(user1);

        const user2 = {
            username: "Friend2",
            email: "test@friend2.com",
            password: "password"
        };
        const friend2 = await User.create(user2);
        const user_id_1 = friend1._id;
        let user_id_2 = friend2._id;
        const friendResponse = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id_1, user_id_2 });
        

        expect(friendResponse.status).toBe(201);
        expect(friendResponse.body.message).toBe("Friendship added");


        const user3 = {
            username: "Friend2",
            email: "test@friend2.com",
            password: "password"
        };
        const friend3 = await User.create(user2);
        user_id_2 = friend3._id;
        const friendResponse2 = await request(app)
            .post("/api/friend/addfriend")
            .send({ user_id_1, user_id_2 });
        

        expect(friendResponse2.status).toBe(201);
        expect(friendResponse2.body.message).toBe("Friendship added");


        const findUser = await User.findOne({ email: "test@friend.com" });
        const userId = findUser?._id;

        const response = await request(app).get(`/api/friend/fetchAll/${userId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("All friend found");
    });

    it("should fetch friends with the most exchanges", async () => {

    });

    it("should display a friend information", async () => {

    });
});
