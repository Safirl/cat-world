import express from "express";
import letterController from "../controllers/letterController.js";
import { authMiddleware } from "../middleware/authMiddleWare.js";

const letterRoutes = express.Router();

letterRoutes.post(
  "/createletter",
  authMiddleware,
  letterController.createLetter
);
letterRoutes.delete(
  "/deleteletter/:id",
  authMiddleware,
  letterController.deleteLetter
);
letterRoutes.get(
  "/showletter/:id",
  authMiddleware,
  letterController.showLetter
);
letterRoutes.get(
  "/getUnreadLetters",
  authMiddleware,
  letterController.getUnreadLetters
);
letterRoutes.get(
  "/getReadLetters",
  authMiddleware,
  letterController.getReadLetters
);

export default letterRoutes;
