import request from 'supertest';
import app from '../src/server';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
import { before } from 'node:test';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

let client: MongoClient;

beforeAll(async () => {
    client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
    } catch (error) {
        console.error(error);
    }

    const db = client.db();
});

afterAll(async () => {
    await client.close();
});

describe("User registration", () => {
    it("should register a new user", async () => {
        const newUser = {
            username: "testUser",
            email: "email@test.com",
            password: "password"
        }

        const db = client.db();
        const response = await request(app)
            .post("/api/users/register")
            .send(newUser);
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");

        console.log(db.collection("users)"));
        const userInDb = await db.collection("users").findOne({email: "email@test.com"});

        expect(userInDb).not.toBeNull();
        expect(userInDb.username).toBe(newUser.username);
        expect(userInDb.email).toBe(newUser.email);
    });
});