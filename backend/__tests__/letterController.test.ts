import request from 'supertest';
import { app } from '../src/app';
import Letter, { ILetter } from '../src/models/Letter';
import UserLetter from '../src/models/UserLetter';
import jwt from 'jsonwebtoken';
import { authToken } from '../setupTests';

//Create a letter before each test
let letter: ILetter;

beforeEach(async () => {
    const letterTest = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        src_img: "example.com/image.jpg",
        typo_id: 2,
        stamp_id: 3
    };

    letter = await Letter.create(letterTest);
});

describe("Letter creation", () => {
    it("should create a new letter", async () => {
        const newLetter = {
            title: "Test Letter",
            content: "This is a test letter.",
            src_img: "example.com/image.jpg",
            typo_id: 1,
            stamp_id: 1
        };

        const response = await request(app)
            .post("/api/letters/createletter")
            .set("Cookie", `token=${authToken}`)
            .send(newLetter);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Letter created successfully");
        expect(response.body.letter).toHaveProperty("_id");
        expect(response.body.letter.title).toBe(newLetter.title);
        expect(response.body.letter.content).toBe(newLetter.content);
        expect(response.body.letter.src_img).toBe(newLetter.src_img);
        expect(response.body.letter.typo_id).toBe(newLetter.typo_id);
        expect(response.body.letter.stamp_id).toBe(newLetter.stamp_id);

        const letterInDb = await Letter.findOne({ title: newLetter.title });
        expect(letterInDb).toBeTruthy();
        expect(letterInDb?.content).toBe(newLetter.content);
    });
});

describe("Letter Deletion", () => {
    it("Should delete letter and associated UserLetter", async () => {
        // Suppression de la lettre
        const deleteResponse = await request(app)
            .delete(`/api/letters/deleteletter/${letter._id}`)
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
            .get(`/api/letters/showletter/${letter._id}`)
            .set("Cookie", `token=${authToken}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Letter found");
        expect(response.body.letter).toMatchObject({
            title: letter.title,
            content: letter.content,
            src_img: letter.src_img,
            typo_id: letter.typo_id,
            stamp_id: letter.stamp_id,
        });
    });
});