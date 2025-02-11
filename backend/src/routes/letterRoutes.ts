import express from 'express';
import letterController from '../controllers/letterController';
const letterRoutes = express.Router();

letterRoutes.post("/createletter", letterController.createLetter);

export default letterRoutes;