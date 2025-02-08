import request from 'supertest';
import {app} from '../src/app';
import User from '../src/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { checkJwtSecret } from '../src/services/authService';
import bcrypt from 'bcryptjs';

beforeEach(async () => {
    const hashedPassword = await bcrypt.hash("password", 10);
    const user =
        {
            username: "toto",
            email: "email@toto.com",
            password: hashedPassword
        }
    await User.create(user);
});

describe("User registration", () => {
    const newUser = {
        username: "testUser",
        email: "email@test.com",
        password: "password"
    }
    it("should register a new user", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send(newUser);
            
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
        
        const userInDb = await User.findOne({email: newUser.email});
        expect(userInDb).toBeTruthy();
        expect(userInDb?.username).toBe(newUser.username);
    });
});

describe("User login", () => {
    it ("should login to a test user", async () => {
        const user = {
            email: "email@toto.com",
            password: "password"
        }

        const response = await request(app)
            .post("/api/auth/login")
            .send({email: user.email, password: user.password});
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User logged in successfully");
        
        //check if the token is valid
        const token: string = response.body.token;
        expect(token).not.toBeUndefined();
        expect(typeof token).toBe("string");

        const secret = checkJwtSecret();

        const decoded = jwt.verify(token, secret) as JwtPayload;
        expect(decoded).toHaveProperty("_id");
        console.log(decoded);

        //check if the user in the database has the same email
        const userInDb = await User.findById(decoded._id);
        expect(userInDb).toBeTruthy();
        expect(userInDb?.email).toBe(user.email);
    });

    it ("should not login to a test user with wrong password", async () => {
        const user = {
            email: "email@toto.com",
            password: "wrongpassword"
        }
        const response = await request(app)
            .post("/api/auth/login")
            .send({email: user.email, password: user.password});
        
        expect(response.status).toBe(401);
    });
});

//@todo ajouter un test pour le logout
describe("User logout", () => {
    it ("should logout the user", async () => {
        const user = {
            email: "email@toto.com",
            password: "password"
        }

    });
});

// const checkTokenValidity = (token: string) => {
//     expect(token).not.toBeUndefined();
//     expect(typeof token).toBe("string");

//     const secret = checkJwtSecret();

//     const decoded = jwt.verify(token, secret) as JwtPayload;
//     expect(decoded).toHaveProperty("_id");
//     return decoded;
// }

// const checkUserAuthenticated = async (decoded: JwtPayload, user: {email: string, password: string}) => {
//     const userInDb = await User.findById(decoded._id);
//     expect(userInDb).toBeTruthy();
//     expect(userInDb?.email).toBe(user.email);
// }