import request from 'supertest';
import { app } from '../src/app';
import Letter, { ILetter } from '../src/models/Letter';
import UserLetter from '../src/models/UserLetter';
import { authToken } from '../src/setupTests';
import User, { IUser } from '../src/models/User'
import mongoose, { ObjectId } from 'mongoose';
import path from "path";
import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv"


dotenv.config()

//Create a letter before each test
let letter: ILetter;
let friend: IUser;
let testImgId = uuidv4();

beforeAll(async () => {
    //Create image inside cloudinary
    await cloudinary.uploader.upload(path.join(__dirname, "../test_data/test-cat.webp"), { public_id: testImgId, type: "private", folder: process.env.CLOUDINARY_FOLDER })
})

afterAll(async () => {
    await cloudinary.uploader.destroy(testImgId);
})

beforeEach(async () => {
    if (!mongoose.connection.db) {
        return;
    }
    const letterTest = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        img_id: testImgId,
        typo_id: 2,
        stamp: "3"
    };
    letter = await Letter.create(letterTest);
    friend = await User.create({ username: "Bob", email: "bob@example.com", password: "password", color: "red" });
});


describe("Letter creation", () => {
    let img_id: string;
    afterAll(async () => {
        if (img_id) {
            cloudinary.uploader.destroy(img_id)
        }
    })
    it("should create a new letter", async () => {
        const receiver_id = (friend._id as ObjectId).toString();
        const newLetter = {
            title: "Test Letter",
            content: "This is a test letter.",
            src_img: path.join(__dirname, "../test_data/test-cat.webp"),
            stamp: "test",
            receiver_id
        };

        const response = await request(app)
            .post("/api/letter/createletter")
            .set("Cookie", `token=${authToken}`)
            .set("Content-Type", "multipart/form-data")
            .field("receiver_id", receiver_id)
            .field("title", newLetter.title)
            .field("content", newLetter.content)
            .field("stamp", newLetter.stamp)
            .attach("src_img", newLetter.src_img)

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Letter created successfully");
        expect(response.body.letter).toHaveProperty("_id");
        expect(response.body.letter.title).toBe(newLetter.title);
        expect(response.body.letter.content).toBe(newLetter.content);
        expect(response.body.letter.stamp).toBe(newLetter.stamp);
        expect(response.body.letter.img_id).toBeTruthy();

        const url = cloudinary.url(response.body.letter.img_id);
        expect(url).toBeTruthy();
        //Assign global variable to delete it off the cloudinary later.
        img_id = response.body.letter.img_id;

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
        //Check if the image has been deleted from cloudinary.
        await expect(cloudinary.api.resource(testImgId)).rejects.toMatchObject({
            error: { http_code: 404 },
        });

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
            typo_id: letter.typo_id,
            stamp: letter.stamp,
        });
        //Check if the image is accessible
        const imageResponse = await request(response.body.img_url)
            .get("")

        expect(imageResponse.status).toBe(200);
    });
});