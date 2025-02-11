import { Request, Response, RequestHandler } from 'express';

import Letter from '../models/Letter';
import User from '../models/User';
import UserLetter from '../models/UserLetter';

import letterController from './letterController';
import authController from './authController';



class UserLetterController {
    public createUserLetter: RequestHandler = async (req:Request, res:Response) => {
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
    
}

export default new UserLetterController();