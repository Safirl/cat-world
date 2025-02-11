import request from 'supertest';
import {app} from '../src/app';
import Letter from '../src/models/Letter';
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

describe("Letter User Link", () => {
    it("Should delete letter", async () => {
   
        const newLetter = {
            title: "Test Letter",
            content: "This is a test letter.",
            src_img: "example.com/image.jpg",
            typo_id: 1,
            stamp_id: 1
        };

        const letterResponse = await request(app)
            .post("/api/letters/createletter")
            .send(newLetter);

        expect(letterResponse.status).toBe(201);
        expect(letterResponse.body).toHaveProperty("letter");
        expect(letterResponse.body.letter).toHaveProperty("_id");

        const letterId = letterResponse.body.letter._id;

   
        const letterInDb = await Letter.findById(letterId);
        expect(letterInDb).toBeTruthy();


        const deleteResponse = await request(app)
            .delete(`/api/letters/deleteletter/${letterId}`);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.message).toBe("Letter deleted successfully");


        const deletedLetter = await Letter.findById(letterId);
        expect(deletedLetter).toBeNull();
    });
});


// describe("Letter list display", () => {
//     it("should fetch all leters received by a user", async () => {

//     });

//     it("should fetch all unread letters received by a user", async () => {

//     });
// });

// describe("Update letter status", () => {
//     it("should changed the letter status from new to read", async () => {

//     });
// })