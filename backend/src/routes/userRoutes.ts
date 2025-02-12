import express from 'express';
import UserController from '../controllers/userController';


const userRoutes = express.Router();
userRoutes.get('/fetch/:id', UserController.fetch);
userRoutes.delete('/delete/:id', UserController.deleteUser)
userRoutes.post('/modifypassword/:id', UserController.modifyPassword);
userRoutes.post('/colorcat/:id', UserController.modifyColor);

export default userRoutes;
