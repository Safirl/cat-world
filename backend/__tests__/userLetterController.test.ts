import request from 'supertest';
import { app } from '../src/app';
import Letter from '../src/models/Letter';
import User from '../src/models/User';
import UserLetter from '../src/models/UserLetter';

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

    const receiver = await User.create(receiverTest);
    const sender = await User.create(senderTest);

    const letterTest = {
        title: "Test Letter cat",
        content: "This is a test letter about cat.",
        src_img: "example.com/image.jpg",
        typo_id: 2,
        stamp_id: 3
    };

    const letter = await Letter.create(letterTest);

    const userLetterTest = {
        letter_id: letter._id,
        sender_id: sender._id,
        receiver_id: receiver._id,
        state: false
    };

    const userLetter = await UserLetter.create(userLetterTest);
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

        const senderResponse = await request(app)
            .post("/api/auth/register")
            .send(newSender);

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

        // Vérification que la lettre a été créée correctement
        expect(letterResponse.body).toHaveProperty("letter");
        expect(letterResponse.body.letter).toHaveProperty("_id");

        const newUserLetter = {
            receiver_id: receiverResponse.body.user._id,
            sender_id: senderResponse.body.user._id,
            letter_id: letterResponse.body.letter._id,
            state: false
        };

        const userLetterResponse = await request(app)
            .post("/api/createUserletter")
            .send(newUserLetter);

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
        
        expect(receiverInDb).toBeTruthy();
        expect(receiverInDb?.username).toBe(newReceiver.username);

        const senderInDb = await User.findOne({ email: newSender.email });
       
        expect(senderInDb).toBeTruthy();
        expect(senderInDb?.username).toBe(newSender.username);

        const letterInDb = await Letter.findOne({ title: newLetter.title });
       
        expect(letterInDb).toBeTruthy();
        expect(letterInDb?.content).toBe(newLetter.content);

        const userLetterInDb = await UserLetter.findOne({
            receiver_id: newUserLetter.receiver_id,
            sender_id: newUserLetter.sender_id,
            letter_id: newUserLetter.letter_id
        });
        expect(userLetterInDb).toBeTruthy();
        expect(userLetterInDb?.receiver_id.toString()).toBe(newUserLetter.receiver_id.toString());
        expect(userLetterInDb?.sender_id.toString()).toBe(newUserLetter.sender_id.toString());
        expect(userLetterInDb?.letter_id.toString()).toBe(newUserLetter.letter_id.toString());
    });
    
});

describe("Update letter status", () => {
    it("should changed the letter status from new to read", async () => {

        // create new user
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
        const sender = await User.create(senderTest);

        // create letter
        const letterTest = {
            title: "Test Letter cat",
            content: "This is a test letter about cat.",
            src_img: "example.com/image.jpg",
            typo_id: 2,
            stamp_id: 3
        };
        const letter = await Letter.create(letterTest);
        const userLetterTest = {
            letter_id: letter._id,
            sender_id: sender._id,
            receiver_id: receiver._id,
            state: false
        };
        const userLetter = await UserLetter.create(userLetterTest);


        // update letter status
        const response = await request(app)
            .put(`/api/updateUserLetter/${userLetter._id}`)
            .send({ state: true });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("UserLetter state updated successfully");
        expect(response.body.userLetter).toHaveProperty("state");
        expect(response.body.userLetter.state).toBe(true);
    });
})




describe("Letter list display", () => {
    it("should fetch all leters received by a user", async () => {
        // create new user
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
        const sender = await User.create(senderTest);

        // create letter
        const letterTest = {
            title: "Test Letter cat",
            content: "This is a test letter about cat.",
            src_img: "example.com/image.jpg",
            typo_id: 2,
            stamp_id: 3
        };
        const letter = await Letter.create(letterTest);

        const letterTest2 = {
            title: "Test Letter cat",
            content: "This is a test letter about cat.",
            src_img: "example.com/image.jpg",
            typo_id: 2,
            stamp_id: 3
        };
        const letter2 = await Letter.create(letterTest2);

        const userLetterTest = {
            letter_id: letter._id,
            sender_id: sender._id,
            receiver_id: receiver._id,
            state: false
        };

        const userLetterTest2 = {
            letter_id: letter2._id,
            sender_id: sender._id,
            receiver_id: receiver._id,
            state: false
        };
        const userLetter = await UserLetter.create(userLetterTest);
        const userLetter2 = await UserLetter.create(userLetterTest2);
        const findReceiver = await User.findOne({ email: "test@receiver.com" });
        const receiverId = findReceiver?._id;

        const response = await request(app).get(`/api/fetchAll/${receiverId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("AllUserLetter found");
        expect(response.body.allUserLetter).toBeTruthy();
    });

    it("should fetch all read letters received by a user", async () => {

        // create new user
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
        const sender = await User.create(senderTest);

        // create letter
        const letterTest = {
            title: "Test Letter cat",
            content: "This is a test letter about cat.",
            src_img: "example.com/image.jpg",
            typo_id: 2,
            stamp_id: 3
        };
        const letter = await Letter.create(letterTest);

        const letterTest2 = {
            title: "Test Letter cat",
            content: "This is a test letter about cat.",
            src_img: "example.com/image.jpg",
            typo_id: 2,
            stamp_id: 3
        };
        const letter2 = await Letter.create(letterTest2);

        const letterTest3 = {
            title: "Test Letter cat",
            content: "This is a test letter about cat.",
            src_img: "example.com/image.jpg",
            typo_id: 2,
            stamp_id: 3
        };
        const letter3 = await Letter.create(letterTest3);

        const userLetterTest = {
            letter_id: letter._id,
            sender_id: sender._id,
            receiver_id: receiver._id,
            state: true
        };
        const userLetter = await UserLetter.create(userLetterTest);
        const userLetterTest2 = {
            letter_id: letter2._id,
            sender_id: sender._id,
            receiver_id: receiver._id,
            state: false
        };
        const userLetter2 = await UserLetter.create(userLetterTest2);
        const userLetterTest3 = {
            letter_id: letter3._id,
            sender_id: sender._id,
            receiver_id: receiver._id,
            state: true
        };
        const userLetter3 = await UserLetter.create(userLetterTest3);


        const findReceiver = await User.findOne({ email: "test@receiver.com" });
        const receiverId = findReceiver?._id;

        const response = await request(app).get(`/api/fetchAll/${receiverId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("AllUserLetter found");
        expect(response.body.allUserLetter).toBeTruthy();

    });
});