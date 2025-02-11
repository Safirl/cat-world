import express from 'express';
import authRouter from './routes/authRoutes';
import letterRoutes from './routes/letterRoutes';
import userLetterRoutes from './routes/userLetterRoutes';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

//Reference other routers here.
app.use("/api/auth", authRouter);
app.use('/api/letters', letterRoutes);
app.use('/api', userLetterRoutes);
app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the backend server");
});