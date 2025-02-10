import express from 'express';
import AuthController from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const authRouter = express.Router();

//Reference all the routes linked to the AuthController here.
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);

export default authRouter;