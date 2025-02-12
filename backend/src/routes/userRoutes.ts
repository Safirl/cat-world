import express from 'express';
import AuthController from '../controllers/authController';
import UserController from '../controllers/userController';


const userRoutes = express.Router();
userRoutes.get('/fetch/:id', UserController.fetch);
userRoutes.delete('/delete/:id', UserController.deleteUser)

export default userRoutes;