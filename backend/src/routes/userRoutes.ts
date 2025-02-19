import express from "express";
import UserController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleWare.js";

const userRoutes = express.Router();
userRoutes.get("/fetch/:id?", authMiddleware, UserController.fetch);
userRoutes.delete("/delete/:id", authMiddleware, UserController.deleteUser);
userRoutes.post(
  "/modifypassword/:id",
  authMiddleware,
  UserController.modifyPassword
);
userRoutes.post("/colorcat/:id", authMiddleware, UserController.modifyColor);

export default userRoutes;
