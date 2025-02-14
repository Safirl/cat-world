import request from 'supertest';
import { app } from '../src/app';
import User, { IUser } from '../src/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { authToken } from '../setupTests';

let userTest: IUser;
beforeEach(async () => {
    if (!mongoose.connection.db) {
        console.error("No database connection");
        return;
    }
    const collection = await mongoose.connection.db.collection("users");
    const hashedPassword = await bcrypt.hash("password", 10);
    const userStruct =
    {
        username: "toto",
        email: "email@toto.com",
        password: hashedPassword
    }
    userTest = await User.create(userStruct);
});

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
            .post(`/api/user/colorcat/${userTest._id}`)
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

        expect(deletedUser).toBeFalsy();
    });
});

describe("Fetch user data", () => {
    it("should fetch connected user data", async () => {
        const checkUserResponse = await request(app)
            .get(`/api/user/fetch/${userTest._id}`)
            .set("Cookie", `token=${authToken}`);

        expect(checkUserResponse.status).toBe(200);
        expect(checkUserResponse.body.message).toBe("User fetch");

        expect(checkUserResponse.body.user).toMatchObject({
            username: userTest.username,
            email: userTest.email
        });
    });
});