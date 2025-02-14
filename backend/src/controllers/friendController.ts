import { Request, Response } from 'express';
import Friend from '../models/Friend';


class FriendController {
    public async addFriend(req: Request, res: Response): Promise<void> {
        //@todo verifier si l'amitié n'exist pas déjà
        try {
            const { user_id, friend_id } = req.body;
            const newFriendship = new Friend({
                user_id_1: user_id,
                user_id_2: friend_id
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

    public deleteFriend = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: "Missing friend ID" });
                return;
            }
            const friend = await Friend.findById(id);
            if (!friend) {
                res.status(404).json({ message: "friend not found" });
                return
            }
            await Friend.findByIdAndDelete(id);
            res.status(200).json({ message: "Friend deleted successfully" });


        } catch (error) {
            console.error("Error deleting friend:", error);
            res.status(500).json({ message: "Error deleting friend" });
        }
    };
    public fetchAllFriend = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user_id } = req.params;
            const allFriend = await Friend.find({ user_id });
            console.log("allfriends: ", allFriend)
            if (!allFriend || allFriend.length === 0) {
                res.status(404).json({ message: "allFriend not found" });
                return;
            }
            res.status(200).json({ message: "All friend found", allFriend });
        } catch (error) {
            console.error("Error fetching user letters:", error);
            res.status(500).json({ message: "Error fetching user letters" });
            return;
        }
    }

    public showInformationFriend = async (req: Request, res: Response): Promise<void> => {
        try {
            const { user_Friend_Id } = req.params;
            const friendInformation = await Friend.find({ user_Friend_Id })

            if (!friendInformation) {
                res.status(404).json({ message: "Friend information not found" });
                return;
            }
            res.status(201).json({ message: "Friend information show", friendInformation })

        } catch (error) {
            console.error("Error show information friend", error);
            res.status(500).json({ message: "Error show information friend" });
            return;
        }
    }

}

export default new FriendController()