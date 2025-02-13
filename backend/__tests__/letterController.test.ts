import request from 'supertest';
import {app} from '../src/app';
import Letter from '../src/models/Letter';
import UserLetter from '../src/models/UserLetter';
import exp from 'constants';

beforeEach(async () => {
    const letterTest  = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        src_img: "example.com/image.jpg",
        typo_id: 2,
        stamp_id: 3
    };
    
    await Letter.create(letterTest);
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
            .send(newLetter);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Letter created successfully");
        expect(response.body.letter).toHaveProperty("_id");
        expect(response.body.letter.title).toBe(newLetter.title);
        expect(response.body.letter.content).toBe(newLetter.content);
        expect(response.body.letter.src_img).toBe(newLetter.src_img);
        expect(response.body.letter.typo_id).toBe(newLetter.typo_id);
        expect(response.body.letter.stamp_id).toBe(newLetter.stamp_id);

        const letterInDb = await Letter.findOne({title: newLetter.title});
        expect(letterInDb).toBeTruthy();
        expect(letterInDb?.content).toBe(newLetter.content);
    });
});

describe("Letter Deletion", () => {
    it("Should delete letter and associated UserLetter", async () => {
        // Création d'une lettre test
        const newLetter = {
            title: "Test Letter to Delete",
            content: "This is a test letter to be deleted.",
            src_img: "example.com/image.jpg",
            typo_id: 1,
            stamp_id: 1
        };

        const letterResponse = await request(app)
            .post("/api/letters/createletter")
            .send(newLetter);

        const letterId = letterResponse.body.letter._id;

        // Vérification que la lettre est bien créée
        const letterInDb = await Letter.findById(letterId);
        expect(letterInDb).toBeTruthy();

        // Création d'une relation UserLetter associée
        const newUserLetter = {
            receiver_id: "someReceiverId",
            sender_id: "someSenderId",
            letter_id: letterId,
            state: false
        };

        await UserLetter.create(newUserLetter);

        // Vérification que UserLetter existe
        const userLetterInDb = await UserLetter.findOne({ letter_id: letterId });
        expect(userLetterInDb).toBeTruthy();

        // Suppression de la lettre
        const deleteResponse = await request(app)
            .delete(`/api/letters/deleteletter/${letterId}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Letter and associated UserLetters deleted successfully");

        // Vérification que la lettre et UserLetter ont été supprimées
        const deletedLetter = await Letter.findById(letterId);
        const deletedUserLetter = await UserLetter.findOne({ letter_id: letterId });

        expect(deletedLetter).toBeFalsy();
        expect(deletedUserLetter).toBeFalsy();
    });
});



describe("Show Letter", () => {
    it("Should show letter", async () => {
        // Création d'une lettre test
        const newLetter = {
            title: "Test Letter to Show",
            content: "This is a test letter to be shown.",
            src_img: "example.com/image.jpg",
            typo_id: 1,
            stamp_id: 1
        };

        const letterResponse = await request(app)
            .post("/api/letters/createletter")
            .send(newLetter);

        const letterId = letterResponse.body.letter._id;

        // Récupération de la lettre
        const response = await request(app).get(`/api/letters/showletter/${letterId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Letter found");
        expect(response.body.letter).toMatchObject({
            title: newLetter.title,
            content: newLetter.content,
            src_img: newLetter.src_img,
            typo_id: newLetter.typo_id,
            stamp_id: newLetter.stamp_id,
        });
    });
});