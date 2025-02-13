import express from 'express';
import userLetterController from '../controllers/userLetterController';

const userLetterRoutes = express.Router();

userLetterRoutes.post('/createUserletter', userLetterController.createUserLetter);
userLetterRoutes.put('/updateUserLetter/:id', userLetterController.updateState);
userLetterRoutes.get('/fetchAll/:receiver_id', userLetterController.fetchUserLetter);
userLetterRoutes.get('/fetchAllRead/:receiver_id', userLetterController.fetchUserLetterRead);
export default userLetterRoutes;
