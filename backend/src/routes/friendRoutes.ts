import express from 'express';
import FriendController from '../controllers/friendController';

const friendRoutes = express.Router();

friendRoutes.post("/addfriend", FriendController.addFriend);
friendRoutes.delete("/delete/:id", FriendController.deleteFriend)
friendRoutes.get("/fetchAll/:id", FriendController.fetchAllFriend)
friendRoutes.get("/showfriend/:id", FriendController.showInformationFriend)

export default friendRoutes;
