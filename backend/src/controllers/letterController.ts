import { Request, Response } from "express";
import Letter from "../models/Letter.js";
import UserLetter from "../models/UserLetter.js";
import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuidv4 } from 'uuid';
import sharp from "sharp"
import path from "path"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()

class LetterController {
  public async createLetter(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, stamp, receiver_id } = req.body;

      //Upload img on cloudinary and generate a random id for it and delete the upload file from the blob storage.
      const img = req.file
      let img_id = "";
      if (img) {
        const outputPath = `uploads/${path.parse(img.originalname).name}.webp`;
        await sharp(img.path)
          .toFormat("webp")
          .webp({ quality: 80 })
          .toFile(outputPath)

        img_id = uuidv4();
        await cloudinary.uploader.upload(
          outputPath,
          { public_id: img_id, type: "private", folder: process.env.CLOUDINARY_FOLDER }
        )
        //clean path
        await fs.promises.unlink(img.path)
        await fs.promises.unlink(outputPath)
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
      let img_url = "";
      if (letter.img_id) {
        //@TODO We should add the image format to database instead of using the cloudinary API to get it.
        const imgInfo = await cloudinary.api.resource(`${process.env.CLOUDINARY_FOLDER}/${letter.img_id}`, {
          type: "private"
        })
        img_url = cloudinary.utils.private_download_url(`${process.env.CLOUDINARY_FOLDER}/${letter.img_id}`, imgInfo.format, {
          type: "private",
          expires_at: Math.floor(Date.now() / 1000) + 60
        })
      }

      res.status(200).json({ message: "Letter found", letter, img_url });
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

  public async getPrivateImg(req: Request, res: Response): Promise<void> {
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

      let img_url = "";
      if (letter.img_id) {
        //@TODO We should add the image format to database instead of using the cloudinary API to get it.
        const imgInfo = await cloudinary.api.resource(`${process.env.CLOUDINARY_FOLDER}/${letter.img_id}`, {
          type: "private"
        })
        img_url = cloudinary.url(`${process.env.CLOUDINARY_FOLDER}/${letter.img_id}`, {
          type: "private",
          sign_url: true
        })
        img_url = cloudinary.utils.private_download_url(`${process.env.CLOUDINARY_FOLDER}/${letter.img_id}`, imgInfo.format, {
          type: "private",
          expires_at: Math.floor(Date.now() / 1000) + 60
        })
      }
      res.status(200).json({ message: "Image found", img_url });

    } catch (error) {
      console.error("Error retrieving letter:", error);
      res.status(500).json({ message: "Error retrieving letter" });
    }
  }
}


export default new LetterController();
