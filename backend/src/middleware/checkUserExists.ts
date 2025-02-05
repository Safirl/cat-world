import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;

        if (!email) {
            res.status(400).json({message: "Email is required"});
            return;
        }

        const existingUser = await User.findOne({email: email});

        if (!existingUser) {
            next();
        }
        res.status(400).json({message: "User already exists"});
        return;
    } catch (error) {
        console.error("Can't check user", error);
        res.status(500).json({message: "Can't check user"});
        return;
    }
};