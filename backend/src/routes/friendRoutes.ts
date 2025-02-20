import express from "express";
import FriendController from "../controllers/friendController.js";
import { authMiddleware } from "../middleware/authMiddleWare.js";

const friendRoutes = express.Router();

friendRoutes.post("/addfriend", authMiddleware, FriendController.addFriend);
// friendRoutes.delete(
//   "/delete/:id",
//   authMiddleware,
//   FriendController.deleteFriend
// );
friendRoutes.get("/fetchAll/", authMiddleware, FriendController.fetchAllFriend);
friendRoutes.get(
  "/showfriend/:id",
  authMiddleware,
  FriendController.showFriendInformation
);

export default friendRoutes;
