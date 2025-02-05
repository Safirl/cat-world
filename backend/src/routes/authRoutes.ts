import express from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleWare';
import { checkUserExists } from '../middleware/checkUserExists';

const authRouter = express.Router();

//Reference all the routes linked to the AuthController here.
authRouter.post("/register", checkUserExists, AuthController.register);
authRouter.post("/login", authenticateToken, AuthController.login);

export default authRouter;