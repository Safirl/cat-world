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

// describe("Letter User Link", () => {
//     it("Should add information of letter, receiver, sender", async () => {
//         expect(letterResponse.status).toBe(201);
//         expect(letterResponse.body.message).toBe("Letter created successfully");
//         expect(letterResponse.body.letter).toHaveProperty("_id");

//         expect(receiverResponse.status).toBe(201);
//         expect(receiverResponse.body.message).toBe("User registered successfully");

//         expect(senderResponse.status).toBe(201);
//         expect(senderResponse.body.message).toBe("User registered successfully");

//         expect(userLetterResponse.status).toBe(201);
//         expect(userLetterResponse.body.message).toBe("UserLetter created successfully");

//         const receiverInDb = await User.findOne({ email: newReceiver.email });

//         expect(receiverInDb).toBeTruthy();
//         expect(receiverInDb?.username).toBe(newReceiver.username);

//         const senderInDb = await User.findOne({ email: newSender.email });

//         expect(senderInDb).toBeTruthy();
//         expect(senderInDb?.username).toBe(newSender.username);

//         const letterInDb = await Letter.findOne({ title: newLetter.title });

//         expect(letterInDb).toBeTruthy();
//         expect(letterInDb?.content).toBe(newLetter.content);

//         const userLetterInDb = await UserLetter.findOne({
//             receiver_id: newUserLetter.receiver_id,
//             sender_id: newUserLetter.sender_id,
//             letter_id: newUserLetter.letter_id
//         });
//         expect(userLetterInDb).toBeTruthy();
//         expect(userLetterInDb?.receiver_id.toString()).toBe(newUserLetter.receiver_id.toString());
//         expect(userLetterInDb?.sender_id.toString()).toBe(newUserLetter.sender_id.toString());
//         expect(userLetterInDb?.letter_id.toString()).toBe(newUserLetter.letter_id.toString());
//     });

// });

describe("Update letter status", () => {
    it("should changed the letter status from new to read", async () => {
        // update letter status
        const response = await request(app)
            .put(`/api/updateUserLetter/${userLetter._id}`)
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
            .get(`/api/fetchAll/${receiver._id}`)
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("AllUserLetter found");
        expect(response.body.allUserLetter).toBeTruthy();
    });

    it("should fetch all read letters received by a user", async () => {
        const response = await request(app)
            .get(`/api/fetchAll/${receiver._id}`)
            .set("Cookie", `token=${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("AllUserLetter found");
        expect(response.body.allUserLetter).toBeTruthy();
    });
});