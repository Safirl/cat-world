import request from 'supertest';
import { app } from '../src/app';
import Letter, { ILetter } from '../src/models/Letter';
import User, { IUser } from '../src/models/User';
import UserLetter, { IUserLetter } from '../src/models/UserLetter';
import { authToken } from '../setupTests';

let receiver: IUser;
let sender: IUser;
let letter: ILetter;
let userLetter: IUserLetter;
beforeEach(async () => {
    const receiverTest = {
        username: "receiverUser",
        email: "test@receiver.com",
        password: "password"
    };

    const senderTest = {
        username: "senderUser",
        email: "test@sender.com",
        password: "password"
    };

    receiver = await User.create(receiverTest);
    sender = await User.create(senderTest);

    const letterTest = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        src_img: "example.com/image.jpg",
        typo_id: 2,
        stamp_id: 3
    };

    letter = await Letter.create(letterTest);

    const userLetterTest = {
        letter_id: letter._id,
        sender_id: sender._id,
        receiver_id: receiver._id,
        read: false
    };

    userLetter = await UserLetter.create(userLetterTest);
});

describe("Update letter status", () => {
    it("should changed the letter status from new to read", async () => {
        // update letter status
        const response = await request(app)
            .put(`/api/userLetter/updateUserLetter/${userLetter._id}`)
            .send({ read: true })
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("UserLetter state updated successfully");
        expect(response.body.userLetter).toHaveProperty("read");
        expect(response.body.userLetter.read).toBe(true);
    });
})

describe("Letter list display", () => {
    it("should fetch all leters received by a user", async () => {
        const response = await request(app)
            .get(`/api/userLetter/fetchAll/${receiver._id}`)
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("All userLetters found");
        expect(response.body.allUserLetter).toBeTruthy();
    });

    it("should fetch all read letters received by a user", async () => {
        const response = await request(app)
            .get(`/api/userLetter/fetchAll/${receiver._id}`)
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("All userLetters found");
        expect(response.body.allUserLetter).toBeTruthy();
    });
});