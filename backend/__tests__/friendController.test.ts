import request from "supertest";
import { app } from "../src/app";
import Friend, { IFriend } from "../src/models/Friend";
import User, { IUser } from "../src/models/User";
import mongoose, { ObjectId } from "mongoose";
import { authToken } from "../src/setupTests";
import { userTest } from "../src/setupTests";

let friend: IUser;
let friend1: IUser;
let friendRelation: IFriend
beforeEach(async () => {
    if (!mongoose.connection.db) {
        console.error("No database connection");
        return;
    }
    const friends = await mongoose.connection.db.collection("friend");
    const users = await mongoose.connection.db.collection("users");

    friend = await User.create({ username: "Bob", email: "bob@example.com", password: "password", color: "red" });
    friend1 = await User.create({ username: "Charlie", email: "charlie@example.com", password: "password", color: "red" });
    friendRelation = await Friend.create({ user_id_1: userTest._id, user_id_2: friend._id })
    const friendInDb = await Friend.findById(friendRelation._id);
    // Vérification que le friend est bien créé

    if (!friendInDb) {
        console.error("error while creating friend relation")
    }
})

describe("Add friend", () => {
    it("should add a friend for a user", async () => {
        const user_id = userTest._id;
        const friend_id = friend._id;
        const response = await request(app)
            .post("/api/friend/addfriend")
            .send({ friend_id })
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Ami(e) ajouté(e) avec succès");
        const friendId = response.body.friend._id;

        const friendInDb = await Friend.findById(friendId);
        expect(friendInDb).toBeTruthy();
    });
});

describe("Remove friend", () => {
    it("should remove a friend for a user", async () => {
        const friendId = friendRelation._id;

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
        //adding a second friend for the test
        const friend_id = friend1._id
        const friendResponse1 = await request(app)
            .post("/api/friend/addfriend")
            .send({ friend_id })
            .set("Cookie", `token=${authToken}`);

        expect(friendResponse1.status).toBe(201);
        expect(friendResponse1.body.message).toBe("Ami(e) ajouté(e) avec succès");

        const response = await request(app)
            .get(`/api/friend/fetchAll/`)
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("All friend found");
        expect(response.body.friends.length).toBe(2);
    });

    // it("should fetch friends with the most exchanges", async () => {

    // });

    it("should display a friend information", async () => {
        const user_id = userTest._id;
        const friend_id = friend._id;
        const friendResponse = await request(app)
            .post("/api/friend/addfriend")
            .send({ friend_id })
            .set("Cookie", `token=${authToken}`);

        expect(friendResponse.status).toBe(201);
        expect(friendResponse.body.message).toBe("Ami(e) ajouté(e) avec succès");

        const informationFriendResponse = await request(app)
            .get(`/api/friend/showfriend/${friend_id}`)
            .set("Cookie", `token=${authToken}`);

        expect(informationFriendResponse.status).toBe(201);
        expect(informationFriendResponse.body.message).toBe("Friend information show");
    });
});
