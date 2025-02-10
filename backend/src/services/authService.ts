import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Check if the user is authenticated from a given request
 */
export const isUserAuthenticated = (req: Request): boolean => {
    //Check if the request already has a user object
    if (req.user && req.user.hasOwnProperty("_id")) {
        return true;
    }

    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return false;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded.hasOwnProperty("_id");
    } catch (error) {
        console.error(error)
        return false;
    }
};

export const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    return secret;
};