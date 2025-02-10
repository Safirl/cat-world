import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { isUserAuthenticated } from '../services/authService';
import jwt from 'jsonwebtoken';

class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        if (isUserAuthenticated(req)) {
            res.status(400).json({ message: "You are already authenticated" });
            return;
        }
        try {
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

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            if (isUserAuthenticated(req)) {
                res.status(400).json({ message: "You are already authenticated" });
                return;
            }

            const { email, password } = req.body;

            const matchingUser = await User.findOne({ email: email });
            if (!matchingUser) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            const isPasswordValid = await bcrypt.compare(password, matchingUser.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            const token = jwt.sign(
                { _id: matchingUser._id }, 
                process.env.JWT_SECRET as string, 
                { expiresIn: "7d" }
            );

            res.status(200).json({ message: "User logged in successfully", token });
        }
        catch (error) {
            res.status(401).json({ message: "Unexepected error when logging in : ", error});
            return;
        }
    }
}

export default new AuthController();