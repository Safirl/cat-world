import request from 'supertest';
import { app } from '../src/app';
import Letter, { ILetter } from '../src/models/Letter';
import UserLetter from '../src/models/UserLetter';
import jwt from 'jsonwebtoken';
import { authToken } from '../setupTests';
import User, { IUser } from '../src/models/User'
import mongoose from 'mongoose';
import { userTest } from '../setupTests';

//Create a letter before each test
let letter: ILetter;
let friend: IUser;

beforeEach(async () => {
    if (!mongoose.connection.db) {
        return;
    }
    const letterTest = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        src_img: "example.com/image.jpg",
        typo_id: 2,
        stamp: "3"
    };
    letter = await Letter.create(letterTest);
    friend = await User.create({ username: "Bob", email: "bob@example.com", password: "password", color: "red" });
});

describe("Letter creation", () => {
    it("should create a new letter", async () => {
        const receiver_id = friend._id;
        const newLetter = {
            title: "Test Letter",
            content: "This is a test letter.",
            src_img: "example.com/image.jpg",
            stamp: "test",
            receiver_id
        };
        const response = await request(app)
            .post("/api/letter/createletter")
            .set("Cookie", `token=${authToken}`)
            .send(newLetter);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Letter created successfully");
        expect(response.body.letter).toHaveProperty("_id");
        expect(response.body.letter.title).toBe(newLetter.title);
        expect(response.body.letter.content).toBe(newLetter.content);
        expect(response.body.letter.src_img).toBe(newLetter.src_img);

        const letterInDb = await Letter.findOne({ title: newLetter.title });
        const userLetterInDb = await UserLetter.findOne(response.body._id)
        expect(letterInDb).toBeTruthy();
        expect(letterInDb?.content).toBe(newLetter.content);
        expect(userLetterInDb).toBeTruthy();
    });
});

describe("Letter Deletion", () => {
    it("Should delete letter and associated UserLetter", async () => {
        expect(letter).toBeTruthy();
        expect(letter._id).toBeTruthy();
        // Suppression de la lettre
        const deleteResponse = await request(app)
            .delete(`/api/letter/deleteletter/${letter._id}`)
            .set("Cookie", `token=${authToken}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Letter and associated UserLetters deleted successfully");

        // Vérification que la lettre et UserLetter ont été supprimées
        const deletedLetter = await Letter.findById(letter._id);
        const deletedUserLetter = await UserLetter.findOne({ letter_id: letter._id });

        expect(deletedLetter).toBeFalsy();
        expect(deletedUserLetter).toBeFalsy();
    });
});

describe("Show Letter", () => {
    it("Should show letter", async () => {
        // Récupération de la lettre
        const response = await request(app)
            .get(`/api/letter/showletter/${letter._id}`)
            .set("Cookie", `token=${authToken}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Letter found");
        expect(response.body.letter).toMatchObject({
            title: letter.title,
            content: letter.content,
            src_img: letter.src_img,
            typo_id: letter.typo_id,
            stamp: letter.stamp,
        });
    });
});