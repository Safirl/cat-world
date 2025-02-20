import express, { Request, Response } from "express";
import AuthController from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleWare.js";

const authRouter = express.Router();

//Reference all the routes linked to the AuthController here.
authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/logout", authMiddleware, AuthController.logout);
authRouter.get("/status", authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({ message: "User is authenticated" });
});

export default authRouter;
