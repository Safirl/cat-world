import { Request, Response } from 'express';
import Friend from '../models/Friend.js';
import { doesUserExistsFromId } from '../services/userService.js'
import mongoose from "mongoose";

class FriendController {
    public async addFriend(req: Request, res: Response): Promise<void> {
        try {
            const { friend_id } = req.body;
            if (!friend_id || typeof friend_id !== "string") {
                res.status(400).json({ message: "ID de l'ami(e) non fourni ou invalide.", target: "friend_id" });
                return;
            }

            // Vérification si l'ID est bien un ObjectId valide
            if (!mongoose.Types.ObjectId.isValid(friend_id)) {
                res.status(404).json({ message: "Nous n'avons pas pu ajouter ton ami(e), renseigne le bon code ami(e)", target: "friend_id" });
                return;
            }

            const userExists = await doesUserExistsFromId(friend_id);
            if (!userExists) {
                res.status(404).json({ message: "Nous n'avons pas pu ajouter ton ami(e), renseigne le bon code ami(e)", target: "friend_id" });
                return;
            }

            const user_id = (req as any).user._id;
            const friendshipExists = await Friend.findOne({
                $or: [
                    { user_id_1: user_id, user_id_2: friend_id },
                    { user_id_1: friend_id, user_id_2: user_id }
                ]
            });

            if (friendshipExists) {
                res.status(400).json({ message: "Vous êtes déjà ami(e)s.", target: "friend_id" });
                return;
            }
            const newFriendship = new Friend({
                user_id_1: user_id,
                user_id_2: friend_id
            });

            await newFriendship.save();
            res.status(201).json({
                message: "Ami(e) ajouté(e) avec succès",
                friend: newFriendship,
            });
        } catch (error) {
            res.status(500).json({ message: "Une erreur interne s'est produite.", error });
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
        }
        catch (error) {
            console.error("Error deleting friend:", error);
            res.status(500).json({ message: "Error deleting friend" });
        }
    };



    public fetchAllFriend = async (req: Request, res: Response): Promise<void> => {
        try {
            const user_id = (req as any).user._id;
            const friendRelations = await Friend.find({
                $or: [{ user_id_1: user_id }, { user_id_2: user_id }]
            }).populate("user_id_1 user_id_2");
            if (!friendRelations || friendRelations.length === 0) {
                res.status(404).json({ message: "You have no friends !" });
                return;
            }
            const friends = friendRelations.map(friend => {
                return friend.user_id_1._id.toString() === user_id.toString() ? friend.user_id_2 : friend.user_id_1
            })

            res.status(200).json({ message: "All friend found", friends });
        } catch (error) {
            console.error("Error fetching friends:", error);
            res.status(500).json({ message: "Error fetching friends" });
            return;
        }
    }

    public showFriendInformation = async (req: Request, res: Response): Promise<void> => {
        try {
            const user_id = (req as any).user._id;
            const { friend_id } = req.params;
            const friendInformation = await Friend.find({
                $or: [
                    { user_id_1: friend_id, user_id_2: user_id },
                    { user_id_2: friend_id, user_id_1: user_id }
                ]
            });

            if (!friendInformation) {
                res.status(404).json({ message: "Friend information not found" });
                return;
            }
            //@todo: on devrait récupérer l'info de l'ami ici
            res.status(201).json({ message: "Friend information show", friendInformation })

        } catch (error) {
            console.error("Error show information friend", error);
            res.status(500).json({ message: "Error show information friend" });
            return;
        }
    }

}

export default new FriendController()