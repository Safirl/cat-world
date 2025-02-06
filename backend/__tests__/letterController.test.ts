import request from 'supertest';
import {app} from '../src/app';
import Letter from '../src/models/Letter';

describe("Letter creation", () => {
    it("should create a new letter", async () => {
        const newLetter = {
            title: "Test Letter",
            content: "This is a test letter.",
            src_img: "http://example.com/image.jpg",
            typo_id: 1,
            stamp_id: 1
        };

        const response = await request(app)
            .post("/api/letters/create")
            .send(newLetter);

        console.log(response.body); // Ajout de logs pour voir la réponse
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Letter created successfully");
        expect(response.body.letter).toHaveProperty("_id");
        expect(response.body.letter.title).toBe(newLetter.title);
        expect(response.body.letter.content).toBe(newLetter.content);
        expect(response.body.letter.src_img).toBe(newLetter.src_img);
        expect(response.body.letter.typo_id).toBe(newLetter.typo_id);
        expect(response.body.letter.stamp_id).toBe(newLetter.stamp_id);
    });
});