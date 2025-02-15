import express from 'express';
import userLetterController from '../controllers/userLetterController';
import { authMiddleware } from '../middleware/authMiddleWare';

const userLetterRoutes = express.Router();

userLetterRoutes.post('/createUserletter', authMiddleware, userLetterController.createUserLetter);
userLetterRoutes.put('/updateUserLetter/:id', authMiddleware, userLetterController.updateState);
userLetterRoutes.get('/fetchAll/:receiver_id', authMiddleware, userLetterController.fetchUserLetter);
userLetterRoutes.get('/fetchAllRead/:receiver_id', authMiddleware, userLetterController.fetchUserLetterRead);
export default userLetterRoutes;
