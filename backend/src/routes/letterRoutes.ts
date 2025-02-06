import express from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleWare';
import { checkUserExists } from '../middleware/checkUserExists';

const letterRoutes = express.Router();

//Reference all the routes linked to the AuthController here.
// letterRoutes.post("/register", checkUserExists, AuthController.register);
// letterRoutes.post("/login", authenticateToken, AuthController.login);

export default letterRoutes;