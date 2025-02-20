import request from 'supertest';
import { app } from '../src/app';
import User, { IUser } from '../src/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { authToken } from '../setupTests';
import Friend from '../src/models/Friend';
import UserLetter from '../src/models/UserLetter';
import { userTest } from '../setupTests';


describe("User modification", () => {
    it("should modify a user password", async () => {
        const userInDb = await User.findById(userTest._id);
        expect(userInDb).toBeTruthy();

        const modifyPasswordResponse = await request(app)
            .post(`/api/user/modifypassword/${userTest._id}`)
            .send({ newPassword: "newSecurePassword123" })
            .set("Cookie", `token=${authToken}`);

        expect(modifyPasswordResponse.status).toBe(201);
        expect(modifyPasswordResponse.body.message).toBe("User modify password");
    });

    it("should modify user avatar color", async () => {
        const userInDb = await User.findById(userTest._id);
        expect(userInDb).toBeTruthy();

        const modifyColorResponse = await request(app)
            .post(`/api/user/colorcat/`)
            .send({ newColor: "white" })
            .set("Cookie", `token=${authToken}`);

        expect(modifyColorResponse.status).toBe(201);
        expect(modifyColorResponse.body.message).toBe("User modify color");
    })
});


describe("User deletetion", () => {
    it("should delete a user", async () => {
        const userInDb = await User.findById(userTest._id);
        expect(userInDb).toBeTruthy();

        // Suppression de l'user
        const deleteResponse = await request(app)
            .delete(`/api/user/delete/${userTest._id}`)
            .set("Cookie", `token=${authToken}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("User deleted successfully");

        // Vérification que la lettre et UserLetter ont été supprimées
        const deletedUser = await User.findById(userTest._id);
        const friend1 = await Friend.findOne({ user_id_1: userTest._id })
        const friend2 = await Friend.findOne({ user_id_2: userTest._id })
        const sender = await UserLetter.findOne({ sender_id: userTest._id })
        const receiver = await UserLetter.findOne({ receiver_id: userTest._id })

        expect(deletedUser).toBeFalsy();
        expect(friend1).toBeFalsy();
        expect(friend2).toBeFalsy();
        expect(sender).toBeFalsy();
        expect(receiver).toBeFalsy();
    });
});

describe("Fetch user data", () => {
    it("should fetch connected user data", async () => {
        const checkUserResponse = await request(app)
            .get(`/api/user/fetch/`)
            .set("Cookie", `token=${authToken}`);

        expect(checkUserResponse.status).toBe(200);
        expect(checkUserResponse.body.message).toBe("User fetch");

        expect(checkUserResponse.body.user).toMatchObject({
            username: userTest.username,
            email: userTest.email
        });
    });
});