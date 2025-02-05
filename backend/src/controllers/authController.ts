import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

class AuthController {
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();
            res.status(201).json({message: "User registered successfully"});
        }
        catch (error) {
            console.error("Can't register user", error);
            res.status(500).json({message: "Can't register user"});
        }
    };
}

export default new AuthController();