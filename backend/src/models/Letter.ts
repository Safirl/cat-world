import mongoose, { Schema, Document, Query } from "mongoose";
import UserLetter from "./UserLetter.js";
import { v2 as cloudinary} from 'cloudinary'

export interface ILetter extends Document {
  title: string;
  content: string;
  img_id: string;
  typo_id: number;
  stamp: string;
}

const LetterSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    img_id: { type: String, required: false },
    typo_id: { type: Number, required: false },
    stamp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }, { timestamps: true, collection: 'letters' });

type PreDeleteQueryMiddleware = Query<any, ILetter> & {
  _conditions: { _id: mongoose.Types.ObjectId };
};

LetterSchema.pre(
  "findOneAndDelete",
  async function (this: PreDeleteQueryMiddleware, next) {
    try {
      if (!mongoose.connection.readyState) {
        return next(new Error("Database not connected"));
      }
      const letter_id = this._conditions._id;
      const deletedLetter = await Letter.findById(letter_id);
      // Delete related image in cloudinary
      if (deletedLetter?.img_id) {
        await cloudinary.uploader.destroy(deletedLetter?.img_id, {invalidate: true})
      }
      // Delete UserLetters associated items
      await UserLetter.deleteMany({ letter_id: letter_id });
      next();
    } catch (error) {
      next(error instanceof Error ? error : new Error(String(error)));
    }
  }
);

const Letter = mongoose.model<ILetter>("Letter", LetterSchema);

export default Letter;
