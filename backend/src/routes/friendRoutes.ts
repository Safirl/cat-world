import express from 'express';
import FriendController from '../controllers/friendController';

const friendRoutes = express.Router();

friendRoutes.post("/addfriend", FriendController.addFriend);

export default friendRoutes;
