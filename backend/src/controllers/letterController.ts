import { Request, Response } from 'express';
import Letter from '../models/Letter';

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
            const deletedLetter = await Letter.findByIdAndDelete(id);

            if (!deletedLetter) {
                res.status(404).json({ message: "Letter not found" });
                return
            }

            res.status(200).json({ message: "Letter deleted successfully" });
        } catch (error) {
            console.error("Error deleting letter:", error);
            res.status(500).json({ message: "Error deleting letter" });
        }
    };
}

export default new LetterController();