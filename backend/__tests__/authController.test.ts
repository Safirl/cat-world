import request from 'supertest';
import { app } from '../src/app';
import User, { IUser } from '../src/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getJwtSecret } from '../src/services/authService';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

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

        const userInDb = await User.findOne({ email: newUser.email });
        expect(userInDb).toBeTruthy();
        expect(userInDb?.username).toBe(newUser.username);
    });
});

describe("User login", () => {
    it("should login to a test user", async () => {
        if (!mongoose.connection.db) {
            console.error("No database connection");
            return;
        }
        const collection = await mongoose.connection.db.collection("users");
        const users = await collection.findOne();
        //console.log(users)
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: userTest.email, password: "password" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User logged in successfully");

        //check if the token is valid
        const token: string = response.body.token;
        expect(token).not.toBeUndefined();
        expect(typeof token).toBe("string");

        const secret = getJwtSecret();

        const decoded = jwt.verify(token, secret) as JwtPayload;
        expect(decoded).toHaveProperty("_id");

        //check if the user in the database has the same email
        const userInDb = await User.findById(decoded._id);
        expect(userInDb).toBeTruthy();
        expect(userInDb?.email).toBe(userTest.email);
    });

    it("should not login to a test user with wrong password", async () => {
        const user = {
            email: "email@toto.com",
            password: "wrongpassword"
        }
        const response = await request(app)
            .post("/api/auth/login")
            .send({ email: user.email, password: user.password });

        expect(response.status).toBe(401);
    });

    it("should not login to a test user with invalid token and no creditentials", async () => {
        const token = jwt.sign(
            { _id: "1234" },
            "hacker-test-key",
            { expiresIn: "7d" }
        );

        const response = await request(app)
            .post("/api/auth/login")

        expect(response.status).toBe(401);
    });
});

// describe("User logout", () => {
//     it("should logout a user")
// });