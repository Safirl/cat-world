import request from 'supertest';
import {app} from '../src/app';

import User from '../src/models/User';

describe("User modification", () => {
    it("should modify a user password", async () => {
        const newUser = {
            username: "testUser1",
            email: "email@test.com",
            password: "password",
            color: 'black'
        }
        const userResponse = await request(app)
            .post("/api/auth/register")
            .send(newUser);

        const userId = userResponse.body?.user?._id; // Use optional chaining to avoid undefined errors
        if (!userId) {
            throw new Error("User ID not returned from registration API");
        }
        const userInDb = await User.findById(userId);
        expect(userInDb).toBeTruthy();

        const modifyPasswordResponse = await request(app)
        .post(`/api/user/modifypassword/${userId}`)
        .send({ newPassword: "newSecurePassword123" });

        expect(modifyPasswordResponse.status).toBe(201);
        expect(modifyPasswordResponse.body.message).toBe("User modify password");
    });

    it("should modify user avatar color", async () => {
        const newUser = {
            username: "testUser1",
            email: "email@test.com",
            password: "password",
            color: 'black'
        }
        const userResponse = await request(app)
            .post("/api/auth/register")
            .send(newUser);

        const userId = userResponse.body?.user?._id; // Use optional chaining to avoid undefined errors
        if (!userId) {
            throw new Error("User ID not returned from registration API");
        }
        const userInDb = await User.findById(userId);
        expect(userInDb).toBeTruthy();


        const modifyColorResponse = await request(app)
        .post(`/api/user/colorcat/${userId}`)
        .send({ newColor: "white" });

        expect(modifyColorResponse.status).toBe(201);
        expect(modifyColorResponse.body.message).toBe("User modify color");

    })
});


describe("User deletetion", () => {
    it("should delete a user", async () => {
        const newUser = {
            username: "testUser1",
            email: "email@test.com",
            password: "password"
        }

        const userResponse = await request(app)
            .post("/api/auth/register")
            .send(newUser);

        const userId = userResponse.body.user._id;
        // Vérification que la lettre est bien créée
        const userInDb = await User.findById(userId);
        expect(userInDb).toBeTruthy();


        // Suppression de l'user
        const deleteResponse = await request(app)
            .delete(`/api/user/delete/${userId}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("User deleted successfully");

        // Vérification que la lettre et UserLetter ont été supprimées
        const deletedUser = await User.findById(userId);

        expect(deletedUser).toBeFalsy();
    });
});

describe("Fetch user data", () => {
    it("should fetch connected user data", async () => {
        // Création d'un utilisateur test
        const newUser = {
            username: "testUser",
            email: "test@user.com",
            password: "password"
        };

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send(newUser);

        const userID = registerResponse.body.user?._id;
        const checkUserResponse = await request(app).get(`/api/user/fetch/${userID}`);
   
        expect(checkUserResponse.status).toBe(200);
        expect(checkUserResponse.body.message).toBe("User fetch");

        expect(checkUserResponse.body.user).toMatchObject({
            username: newUser.username,
            email: newUser.email
        });
    });
});