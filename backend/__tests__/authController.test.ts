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
   // await db.collection('users').deleteMany({}); // Nettoyage de la collection users
});

afterAll(async () => {
    await client.close();
});

describe("User registration", () => {
    it(" should register a new user", async () => {
        const newUser = {
            username: "testUser",
            email: "email@test.com",
            password: "password"
        }

        const response = await request(app)
            .post("/api/auth/register")
            .send(newUser);
        console.log("response.body", response.body);
        console.log("response.status", response.status);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("User registered successfully");
        
        const db = client.db();
        console.log(db.collection("users)"));
        const userInDb = await db.collection("users").findOne({email: "email@test.com"});

        expect(userInDb).not.toBeNull();
        expect(userInDb?.username).toBe(newUser.username);
        expect(userInDb?.email).toBe(newUser.email);
    });
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
