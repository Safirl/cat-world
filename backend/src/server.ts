import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongod from 'mongod';
import db from './config/db';
import connectDB from './config/db';
import authRouter from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the backend server");
});

//Reference other routes here.
app.use("/api/auth", authRouter);

connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err: any) => {
        console.error(err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;