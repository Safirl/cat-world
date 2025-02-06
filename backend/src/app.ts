import express from 'express';
import authRouter from './routes/authRoutes';
import { Request, Response } from 'express';

export const app = express();
app.use(express.json());

//Reference other routers here.
app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the backend server");
});