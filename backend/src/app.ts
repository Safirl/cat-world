import express from 'express';
import authRouter from './routes/authRoutes';
import letterRoutes from './routes/letterRoutes';
import userLetterRoutes from './routes/userLetterRoutes';
import userRoutes from './routes/userRoutes'
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from "cookie-parser";
import friendRoutes from './routes/friendRoutes';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cookieParser())

console.log(process.env.FRONTEND_URL);

app.use(cors({
    origin: "https://frontend-cat-world.osc-fr1.scalingo.io",
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