import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

class AuthController {
    public async register(req: Request, res: Response): Promise<void> {
        console.log("is in the fonction");
        try {
            console.log("Received data: ----------------------------------------------------------------------w", req.body);
            const { username, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();
            res.status(201).json({ message: "User registered successfully" });
        }
        catch (error) {
            console.error("Can't register user", error);
            res.status(500).json({message: "Can't register user", error});
        }
    };

    public async login(req: Request, res: Response): Promise<void> {
        
    }
}

export default new AuthController();