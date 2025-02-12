import express from 'express';
import AuthController from '../controllers/authController';
import UserController from '../controllers/userController';


const authRouter = express.Router();
authRouter.get('/fetch/:id', UserController.fetch);

export default authRouter;