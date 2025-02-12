import express from 'express';
import { Request, Response } from 'express';
import AuthController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleWare';
import LetterController from '../controllers/letterController';
import UserController from '../controllers/userController';

const authRouter = express.Router();

//Reference all the routes linked to the AuthController here.
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post('/letter', LetterController.createLetter);
authRouter.get('/fetch/:id', UserController.fetch);
authRouter.get("/status", authMiddleware, (req: Request, res: Response) => {
    res.status(200).json({ message: "User is authenticated" });
});

export default authRouter;