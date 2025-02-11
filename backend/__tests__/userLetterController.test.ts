import request from 'supertest';
import {app} from '../src/app';
import Letter from '../src/models/Letter';
import User from '../src/models/User';
import UserLetter from '../src/models/UserLetter';

beforeEach(async () => {
    const letterTest  = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        src_img: "example.com/image.jpg",
        typo_id: 2,
        stamp_id: 3
    };
    const userTest = {
        username: "testUser",
        email: "test@user.com",
        password: "password"
    }

    const userLetterTest = {
        letter_id: 1,
        user_id: 1,
        state: "unread"
    }

    await User.create(userTest);
    await Letter.create(letterTest);
});

describe("Letter User Link", () => {
    it("Should add information of letter and user", async () => {
        const newLetter = {
            _id:"1",
            title: "Test Letter",
            content: "This is a test letter.",
            src_img: "example.com/image.jpg",
            typo_id: 1,
            stamp_id: 1
        };
        const newUser = {
            _id:"1",
            username: "testUserCat",
            email: "testCat@user.com",
            password: "passwordCat"
        };

        const newUserLetter = {
            user_id: newUser?._id.toString(),
            letter_id: newLetter?._id.toString(),
            state: "unread"
        };

        const responseUserLetter = await request(app)
            .post("/api/link/createUserletter")
            .send(newUserLetter);

        const responseLetter = await request(app)
            .post("/api/letters/createletter")
            .send(newLetter);
        
            const responseUser = await request(app)
            .post("/api/auth/register")
            .send(newUser);

        expect(responseLetter.status).toBe(201);
        expect(responseLetter.body.message).toBe("Letter created successfully");
        expect(responseLetter.body.letter).toHaveProperty("_id");
        
        expect(responseUser.status).toBe(201);
        expect(responseUser.body.message).toBe("User registered successfully");

        expect(responseUserLetter.status).toBe(201);
        expect(responseUserLetter.body.message).toBe("UserLetter created successfully");

        const userInDb = await User.findOne({email: newUser.email});
        expect(userInDb).toBeTruthy();
        expect(userInDb?.username).toBe(newUser.username);

        const letterInDb = await Letter.findOne({title: newLetter.title});
        expect(letterInDb).toBeTruthy();
        expect(letterInDb?.content).toBe(newLetter.content);

        const userLetterInD = await UserLetter.findOne({
            user_id: newUserLetter.user_id,
            letter_id: newUserLetter.letter_id
        });        
        expect(userLetterInD).toBeTruthy();
        expect(userLetterInD?.user_id.toString()).toBe(newUserLetter.user_id.toString());
        expect(userLetterInD?.letter_id.toString()).toBe(newUserLetter.letter_id.toString());




    });
});