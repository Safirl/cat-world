import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

class UserController {
    public fetch = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "Missing user ID" });
                return;
            }


            const user = await User.findById(id);

            if (!user) {
                res.status(404).json({ message: "user not found" });
                return;
            }
            res.status(200).json({ message: "User fetch", user });
        } catch (error) {
            console.error("Error retrieving user:", error);
            res.status(500).json({ message: "Error retrieving user" });
        }

    }
    public deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "Missing user ID" });
                return;
            }
            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return
            }
            await User.findByIdAndDelete(id);
            res.status(200).json({ message: "User deleted successfully" });


        } catch (error) {
            console.error("Error deleting user:", error);
            res.status(500).json({ message: "Error deleting User" });
        }
    }

    public modifyPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;
            if (!newPassword) {
                res.status(400).json({ message: "New password is required" });
                return;
            }

            if (!id) {
                res.status(400).json({ message: "User ID is missing" });
                return;
            }

            if (!newPassword) {
                res.status(400).json({ message: "New password is required" });
                return;
            }

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();

            res.status(201).json({ message: "User modify password" });
        } catch (error) {
            console.error("Error modifying password:", error);
            res.status(500).json({ message: "Error modifying password" });
        }
    };


    // Modifier la couleur d'avatar
    public modifyColor = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { newColor } = req.body;
            if (!newColor) {
                res.status(400).json({ message: "La nouvelle couleur est requise" });
                return;
            }

            const user = await User.findById(id);
            if (!user) {
                res.status(404).json({ message: "Utilisateur non trouvé" });
                return;
            }

            user.color = newColor;
            await user.save();

            res.status(201).json({ message: "User modify color" });
        } catch (error) {
            console.error("Erreur lors de la modification de la couleur:", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    };


};

export default new UserController();

