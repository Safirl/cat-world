import express from 'express';
import userLetterController from '../controllers/userLetterController';

const userLetterRoutes = express.Router();

userLetterRoutes.post('/createUserletter', userLetterController.createUserLetter);
userLetterRoutes.put('/updateUserLetter/:id', userLetterController.updateState);


export default userLetterRoutes;
