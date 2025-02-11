import express from 'express';
import userLetterController from '../controllers/userLetterController';

const userLetterRoutes = express.Router();

userLetterRoutes.post('/createUserletter', userLetterController.createUserLetter);

export default userLetterRoutes;