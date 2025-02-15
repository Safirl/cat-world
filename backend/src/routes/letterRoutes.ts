import express from 'express';
import letterController from '../controllers/letterController';
import { authMiddleware } from '../middleware/authMiddleWare';

const letterRoutes = express.Router();

letterRoutes.post("/createletter", authMiddleware, letterController.createLetter);
letterRoutes.delete("/deleteletter/:id", authMiddleware, letterController.deleteLetter);
letterRoutes.get('/showletter/:id', authMiddleware, letterController.showLetter);

export default letterRoutes;
