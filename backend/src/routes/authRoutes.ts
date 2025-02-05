import express from 'express';
import AuthController from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleWare';
import { checkUserExists } from '../middleware/checkUserExists';

const router = express.Router();

router.post("/register", checkUserExists, AuthController.register);

export default router;