import request from 'supertest';
import {app} from '../src/app';

import User from '../src/models/User';


//@todo ajouter un test pour la modification des données utilisateur
describe("User modification", () => {
    it("should modify a user username", async () => {
        const user = {
            username: "testUser1",
            email: "email@test.com",
            password: "password"
        }
    });

    it("should modify user avatar color", async () => {

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
            .post("/api/user/delete")
            .send(newUser);

        const userId = userResponse.body.user._id;

        // Vérification que la lettre est bien créée
        const userInDb = await User.findById(userId);
        expect(userInDb).toBeTruthy();


        // Suppression de la lettre
        const deleteResponse = await request(app)
            .delete(`/api/user/delete/${userId}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("user deleted successfully");

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
        console.log("userID récupéré après inscription:", userID);

        expect

        const checkUserResponse = await request(app).get(`/api/user/fetch/${userID}`);
        console.log("Réponse de l'API après récupération:", checkUserResponse.status, checkUserResponse.body);

   
        expect(checkUserResponse.status).toBe(200);
        expect(checkUserResponse.body.message).toBe("User fetch");

        expect(checkUserResponse.body.user).toMatchObject({
            username: newUser.username,
            email: newUser.email
        });
    });
});