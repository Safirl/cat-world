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
}

export default new LetterController();