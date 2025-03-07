import authRouter from './routes/authRoutes.js';
import letterRoutes from './routes/letterRoutes.js';
import userLetterRoutes from './routes/userLetterRoutes.js';
import userRoutes from './routes/userRoutes.js'
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import friendRoutes from './routes/friendRoutes.js';

dotenv.config();

export const app = express();
app.use(cookieParser())
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL || "https://frontend-cat-world.osc-fr1.scalingo.io",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

//Reference other routers here.
app.use("/api/auth", authRouter);
app.use('/api/letter', letterRoutes);
app.use('/api/userLetter', userLetterRoutes);
app.use('/api/user', userRoutes);
app.use('/api/friend', friendRoutes)
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the backend server");
});