import { Request, Response } from "express";
import Letter, { ILetter } from "../models/Letter.js";
import UserLetter from "../models/UserLetter.js";
import userLetterController from "./userLetterController.js";
import { app } from "../app.js";

class LetterController {
  public async createLetter(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, src_img, stamp, receiver_id } = req.body;
      const sender_id = (req as any).user._id
      if (!sender_id) {
        res.status(403).json({ message: "Can't create letter, sender is not valid !" });
        return;
      }
      const newLetterModel = {
        title,
        content,
        src_img,
        stamp
      };

      const newLetter = await Letter.create(newLetterModel);
      const newUserLetter = {
        letter_id: newLetter._id,
        sender_id,
        receiver_id,
        read: false,
      };
      await UserLetter.create(newUserLetter);

      //@todo: est-ce qu'on veut renvoyer la letter ou la userLetter ? La seule info qu'on a envie de stocker côté front
      //  pour moi c'est les id des sender et receiver pour ensuite retrouver la lettre, mais l'inverse n'est pas possible.
      res
        .status(201)
        .json({ message: "Letter created successfully", letter: newLetter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Can't create letter", error });
    }
  }

  public async deleteLetter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Vérifier si la lettre existe
      const letter = await Letter.findById(id);
      if (!letter) {
        res.status(404).json({ message: "Letter not found" });
        return;
      }

      // Supprimer la lettre
      await Letter.findByIdAndDelete(id);

      res
        .status(200)
        .json({
          message: "Letter and associated UserLetters deleted successfully",
        });
    } catch (error) {
      res.status(500).json({ message: "Error deleting letter" });
    }
  }

  public async showLetter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Missing letter ID" });
        return;
      }

      const letter = await Letter.findById(id);

      if (!letter) {
        res.status(404).json({ message: "Letter not found" });
        return;
      }
      res.status(200).json({ message: "Letter found", letter });
    } catch (error) {
      console.error("Error retrieving letter:", error);
      res.status(500).json({ message: "Error retrieving letter" });
    }
  }

  public async getUnreadLetters(req: Request, res: Response): Promise<void> {
    try {
      const id = (req as any).user._id
      if (!id) {
        res.status(400).json({ message: "Missing letter ID" });
        return;
      }

      const unreadLetters = await UserLetter.find({
        receiver_id: id,
        read: false
      })
        .populate("letter_id")
        .populate("sender_id", "username email")

      if (!unreadLetters) {
        res.status(200).json({ message: "no letters found", letters: [] });
      }

      res.status(200).json({ message: "unread letters found", letters: unreadLetters });
    } catch (error) {
      console.error("Error retrieving letter:", error);
      res.status(500).json({ message: "Error retrieving letter" });
    }
  }
  public async getReadLetters(req: Request, res: Response): Promise<void> {
    try {
      const id = (req as any).user._id
      if (!id) {
        res.status(400).json({ message: "Missing letter ID" });
        return;
      }

      const readLetters = await UserLetter.find({
        receiver_id: id,
        read: true
      })
        .populate("letter_id")
        .populate("sender_id", "username email")

      if (!readLetters) {
        res.status(200).json({ message: "no letters found", letters: [] });
      }

      res.status(200).json({ message: "read letters found", letters: readLetters });
    } catch (error) {
      console.error("Error retrieving letter:", error);
      res.status(500).json({ message: "Error retrieving letter" });
    }
  }
}


export default new LetterController();
