import request from 'supertest';
import {app} from '../src/app';
import User from '../src/models/User';

describe("User registration", () => {
    it("should register a new user", async () => {
        const newUser = {
            username: "testUser",
            email: "email@test.com",
            password: "password"
        }

        const response = await request(app)
            .post("/api/auth/register")
            .send(newUser);
            
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
        
        const userInDb = await User.findOne({email: newUser.email});
        expect(userInDb).toBeTruthy();
        expect(userInDb?.username).toBe(newUser.username);
    }, 10000);  // Ajout d'un timeout plus long
});

describe("User login", () => {
    it ("should login to a test user", async () => {
        const user = {
            username: "testUser2",
            email: "email@test.com2",
            password: "password2"
        }

        const response = await request(app)
            .post("/api/auth/login")
            .send({email: user.email, password: user.password});
        
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User logged in successfully");
            
        //@todo je m'attends à recevoir un token de connexion
        const token = response.body.token;
        expect(token).not.toBeNull();
    });
});

//@todo ajouter un test pour le logout
describe("User logout", () => {
    it ("should logout the user", async () => {
        const user = {
            username: "testUser",
            email: "email@test.com",
            password: "password"
        }
    });
});
