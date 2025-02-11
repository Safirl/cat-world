import request from 'supertest';
import { app } from '../src/app';
import Letter from '../src/models/Letter';
import User from '../src/models/User';
import UserLetter from '../src/models/UserLetter';

beforeEach(async () => {
    await User.deleteMany({});
    await Letter.deleteMany({});
    await UserLetter.deleteMany({});

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

    const receiver = await User.create(receiverTest);
    console.log("Receiver created:", receiver);

    const sender = await User.create(senderTest);
    console.log("Sender created:", sender);

    const letterTest = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        src_img: "example.com/image.jpg",
        typo_id: 2,
        stamp_id: 3
    };

    const letter = await Letter.create(letterTest);
    console.log("Letter created:", letter);

    const userLetterTest = {
        letter_id: letter._id,
        sender_id: sender._id,
        receiver_id: receiver._id,
        state: "unread"
    };

    const userLetter = await UserLetter.create(userLetterTest);
    console.log("UserLetter created:", userLetter);
});

describe("Letter User Link", () => {
    it("Should add information of letter, receiver, sender", async () => {
        const newReceiver = {
            username: "testReceiverCat",
            email: "ReceiverCat@user.com",
            password: "passwordCat"
        };

        const newSender = {
            username: "testSenderCat",
            email: "SenderCat@user.com",
            password: "passwordCat"
        };

        const receiverResponse = await request(app)
            .post("/api/auth/register")
            .send(newReceiver);
        console.log("Receiver Response:", receiverResponse.body);

        const senderResponse = await request(app)
            .post("/api/auth/register")
            .send(newSender);
        console.log("Sender Response:", senderResponse.body);

        // Vérification que les utilisateurs ont été créés correctement
        expect(receiverResponse.body).toHaveProperty("user");
        expect(receiverResponse.body.user).toHaveProperty("_id");
        expect(senderResponse.body).toHaveProperty("user");
        expect(senderResponse.body.user).toHaveProperty("_id");

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
        console.log("Letter Response:", letterResponse.body);

        // Vérification que la lettre a été créée correctement
        expect(letterResponse.body).toHaveProperty("letter");
        expect(letterResponse.body.letter).toHaveProperty("_id");

        const newUserLetter = {
            receiver_id: receiverResponse.body.user._id,
            sender_id: senderResponse.body.user._id,
            letter_id: letterResponse.body.letter._id,
            state: "unread"
        };

        const userLetterResponse = await request(app)
            .post("/api/createUserletter")
            .send(newUserLetter);
        console.log("UserLetter Response:", userLetterResponse.body);

        expect(letterResponse.status).toBe(201);
        expect(letterResponse.body.message).toBe("Letter created successfully");
        expect(letterResponse.body.letter).toHaveProperty("_id");

        expect(receiverResponse.status).toBe(201);
        expect(receiverResponse.body.message).toBe("User registered successfully");

        expect(senderResponse.status).toBe(201);
        expect(senderResponse.body.message).toBe("User registered successfully");

        expect(userLetterResponse.status).toBe(201);
        expect(userLetterResponse.body.message).toBe("UserLetter created successfully");

        const receiverInDb = await User.findOne({ email: newReceiver.email });
        console.log("Receiver in DB:", receiverInDb);
        expect(receiverInDb).toBeTruthy();
        expect(receiverInDb?.username).toBe(newReceiver.username);

        const senderInDb = await User.findOne({ email: newSender.email });
        console.log("Sender in DB:", senderInDb);
        expect(senderInDb).toBeTruthy();
        expect(senderInDb?.username).toBe(newSender.username);

        const letterInDb = await Letter.findOne({ title: newLetter.title });
        console.log("Letter in DB:", letterInDb);
        expect(letterInDb).toBeTruthy();
        expect(letterInDb?.content).toBe(newLetter.content);

        const userLetterInDb = await UserLetter.findOne({
            receiver_id: newUserLetter.receiver_id,
            sender_id: newUserLetter.sender_id,
            letter_id: newUserLetter.letter_id
        });
        console.log("UserLetter in DB:", userLetterInDb);
        expect(userLetterInDb).toBeTruthy();
        expect(userLetterInDb?.receiver_id.toString()).toBe(newUserLetter.receiver_id.toString());
        expect(userLetterInDb?.sender_id.toString()).toBe(newUserLetter.sender_id.toString());
        expect(userLetterInDb?.letter_id.toString()).toBe(newUserLetter.letter_id.toString());
    });
});