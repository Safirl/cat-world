import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.body.user = decoded;
        next();
    } catch (error) {
        console.error("Invalid token", error);
        res.status(403).json({message: "Invalid or expired token"});
        return;
    }
};