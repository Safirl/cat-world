import { Request, Response } from 'express';
import Letter from '../models/Letter';
import UserLetter from '../models/UserLetter';

class LetterController {
    public async createLetter(req: Request, res: Response): Promise<void> {
        try {
            const { title, content, src_img, typo_id, stamp_id } = req.body;

            const newLetter = new Letter({
                title,
                content,
                src_img,
                typo_id,
                stamp_id
            });

            await newLetter.save();
            res.status(201).json({ message: "Letter created successfully", letter: newLetter });
        } catch (error) {
            console.error("Can't create letter", error);
            res.status(500).json({ message: "Can't create letter" });
        }
    }

    public async deleteLetter(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            // Vérifier si la lettre existe
            const letter = await Letter.findById(id);
            if (!letter) {
                res.status(404).json({ message: "Letter not found" });
                return
            }

            // Supprimer toutes les entrées associées dans UserLetter
            await UserLetter.deleteMany({ letter_id: id });

            // Supprimer la lettre
            await Letter.findByIdAndDelete(id);

            res.status(200).json({ message: "Letter and associated UserLetters deleted successfully" });
        } catch (error) {
            console.error("Error deleting letter:", error);
            res.status(500).json({ message: "Error deleting letter" });
        }
    };
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
    
}

export default new LetterController();