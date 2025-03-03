import { Request, Response } from "express";
import Letter from "../models/Letter.js";
import UserLetter from "../models/UserLetter.js";
import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid';
import fs from "fs"

class LetterController {
  public async createLetter(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, stamp, receiver_id } = req.body;

      //Upload img on cloudinary and generate a random id for it and delete the upload file.
      const img = req.file
      let img_id = "";
      if (img) {
        img_id = uuidv4();
        await cloudinary.uploader.upload(
          img.path,
          { public_id: img_id, type: "private", folder: "catWorld" }
        )
        fs.unlink(img.path, (err) => {
          if (err) {
            console.error("Error when deleting upload file :", err);
          }
        });
      }

      const sender_id = (req as any).user._id
      if (!sender_id) {
        res.status(403).json({ message: "Can't create letter, sender is not valid !" });
        return;
      }
      const newLetterModel = {
        title,
        content,
        img_id,
        stamp
      };

      const newLetter = await Letter.create(newLetterModel);
      const newUserLetter = {
        letter_id: newLetter._id,
        sender_id,
        receiver_id,
        read: false
      };

      await UserLetter.create(newUserLetter);

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
      //We sign a private URL for the user.
      if (letter.img_id) {
        letter.img_id = cloudinary.url(`/catWorld/${letter.img_id}`, {
          type: "private",
          sign_url: true
        })
      }

      res.status(200).json({ message: "Letter found", letter });
    } catch (error) {
      console.error("Error retrieving letter:", error);
      res.status(500).json({ message: "Error retrieving letter" });
    }
  }

  public async getUnreadLetters(req: Request, res: Response): Promise<void> {
    //@TODO : Unread and read letter should return a list of id, not all the letters. 
    // We don't want to create temporary cloudinary links for each of them, so we should get the info with the showLetter route.
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
