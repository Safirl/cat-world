import mongoose, { Schema, Document, Query } from 'mongoose';
import UserLetter from './UserLetter';

export interface ILetter extends Document {
    title: string;
    content: string;
    src_img: string;
    typo_id: number;
    stamp_id: number;
}

const LetterSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    src_img: { type: String, required: true },
    typo_id: { type: Number, required: false },
    stamp_id: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: 'letters' });

type PreDeleteQueryMiddleware = Query<any, ILetter> & {
    _conditions: { _id: mongoose.Types.ObjectId };
};

LetterSchema.pre("findOneAndDelete", async function (this: PreDeleteQueryMiddleware, next) {
    try {
        if (!mongoose.connection.readyState) {
            return next(new Error("Database not connected"));
        }
        const letter_id = this._conditions._id;
        // Suppression des entrées UserLetter associées
        await UserLetter.deleteMany({ letter_id: letter_id });
        next();
    } catch (error) {
        next(error instanceof Error ? error : new Error(String(error)));
    }
});

const Letter = mongoose.model<ILetter>('Letter', LetterSchema);

export default Letter;