import { Request, Response, RequestHandler } from 'express';

import Letter from '../models/Letter';
import User from '../models/User';
import UserLetter from '../models/UserLetter';
import letterController from './letterController';
import authController from './authController';


class UserLetterController {
    public createUserLetter: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { receiver_id, sender_id, letter_id, state } = req.body;

            const existingEntry = await UserLetter.findOne({ sender_id, receiver_id, letter_id });
            if (existingEntry) {
                res.status(400).json({ message: "UserLetter already exists" });
                return;
            }

            const newUserLetter = new UserLetter({ sender_id, receiver_id, letter_id, state });
            await newUserLetter.save();

            res.status(201).json({ message: "UserLetter created successfully", userLetter: newUserLetter });
            return;
        } catch (error) {
            console.error("Error creating UserLetter:", error);
            res.status(500).json({ message: "Error creating UserLetter" });
            return;
        }
    };

    public updateState: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { read } = req.body;

            const userLetter = await UserLetter.findById(id);
            if (!userLetter) {
                res.status(404).json({ message: "UserLetter not found" });
                return;
            }

            userLetter.read = read;
            await userLetter.save();

            res.status(200).json({ message: "UserLetter state updated successfully", userLetter });
            return;
        } catch (error) {
            console.error("Error updating state:", error);
            res.status(500).json({ message: "Error updating state" });
            return;
        }
    };

    public fetchUserLetter: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { receiver_id } = req.params;
            const allUserLetter = await UserLetter.find({ receiver_id });
            if (!allUserLetter || allUserLetter.length === 0) {
                res.status(404).json({ message: "AllUserLetter not found" });
                return;
            }
            res.status(200).json({ message: "All userLetters found", allUserLetter });
        } catch (error) {
            console.error("Error fetching user letters:", error);
            res.status(500).json({ message: "Error fetching user letters" });
            return;
        }
    };

    public fetchUserLetterRead: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { receiver_id } = req.params;
            const allUserLetterRead = await UserLetter.find({ receiver_id, state: true });
            if (!allUserLetterRead || allUserLetterRead.length === 0) {
                res.status(404).json({ message: "AllUserLetterRead not found" });
                return;
            }
            res.status(200).json({ message: "AllUserLetterRead found", allUserLetterRead });
        } catch (error) {
            console.error("Error fetching read user letters:", error);
            res.status(500).json({ message: "Error fetching read user letters" });
            return;
        }
    };


}

export default new UserLetterController();