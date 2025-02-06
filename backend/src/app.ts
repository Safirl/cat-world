import express from 'express';
import authRouter from './routes/authRoutes';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

//Reference other routers here.
app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the backend server");
});