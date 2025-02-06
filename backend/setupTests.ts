import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export let client: MongoClient;

beforeAll(async () => {
    client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
    } catch (error) {
        console.error("Can't connect to mongo: ", error);
    }
    const db = client.db();
    await db.collection('users').deleteMany({});
});

afterAll(async () => {
    const db = client.db();
    await db.collection('users').deleteMany({});
    await client.close();
});