import express from "express";
import letterController from "../controllers/letterController.js";
import { authMiddleware } from "../middleware/authMiddleWare.js";
import multer from "multer";

const letterRoutes = express.Router();
const upload = multer({ dest: 'uploads/' })

letterRoutes.post(
  "/createletter",
  authMiddleware,
  upload.single('src_img'),
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
