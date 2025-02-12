import { Request, Response } from 'express';
import User from '../models/User';


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
        try{
            const { id } = req.params;
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
};

export default new UserController();

