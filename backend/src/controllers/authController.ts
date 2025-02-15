import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { isUserAuthenticated } from '../services/authService';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';

class AuthController {
    public register = async (req: Request, res: Response): Promise<void> => {
        if (isUserAuthenticated(req)) {
            res.status(400).json({ message: "You are already authenticated, logout first to register a new user." });
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
            this.setTokenInCookies(newUser._id as ObjectId, res);

            res.status(201).json({
                message: "User registered successfully",
                user: newUser,
            });
        }
        catch (error) {
            console.error("Can't register user", error);
            res.status(500).json({ message: "Can't register user", error });
        }
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            if (isUserAuthenticated(req)) {
                res.status(200).json({ message: "You are already authenticated, logout first to login to another account" });
                return;
            }

            const { email, password } = req.body;

            const matchingUser = await User.findOne({ email });
            if (!matchingUser) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            const isPasswordValid = await bcrypt.compare(password, matchingUser.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            this.setTokenInCookies(matchingUser._id as ObjectId, res);

            res.status(200).json({ message: "User logged in successfully" });
        }
        catch (error) {
            res.status(401).json({ message: "Unexepected error when logging in : ", error });
            return;
        }
    }

    // public logout = async (): Promise => {

    // }

    private setTokenInCookies(_id: ObjectId, res: Response) {
        const token = jwt.sign({ _id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    }
}

export default new AuthController();