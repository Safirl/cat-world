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
};

export default new UserController();

