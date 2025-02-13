import { Request, Response } from 'express';
import Friend from '../models/Friend';


class FriendController {
    public async addFriend(req: Request, res: Response): Promise<void> {
        //@todo verifier si l'amitié n'exist pas déjà
        try {
            const { user_id_1, user_id_2 } = req.body;

            const newFriendship = new Friend({
                user_id_1,
                user_id_2
            });

            await newFriendship.save();

            res.status(201).json({
                message: "Friendship added",
                friend: newFriendship,
            });
        }
        catch (error) {
            console.error("Can't add friendship ", error);
            res.status(500).json({ message: "Can't add friend", error });
        }
    };

}

export default new FriendController()