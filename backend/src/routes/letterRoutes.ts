import express from 'express';
import letterController from '../controllers/letterController';

const letterRoutes = express.Router();

letterRoutes.post("/createletter", letterController.createLetter);
letterRoutes.delete("/deleteletter/:id", letterController.deleteLetter);

export default letterRoutes;
