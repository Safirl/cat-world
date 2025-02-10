import mongoose, { Schema, Document } from 'mongoose';

export interface ILetter extends Document {
    username: string;
    email: string;
    password: string;
}

const LetterSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    src_img: { type: String, required: true },
    typo_id: { type: Number, required: false },
    stamp_id: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
}, {timestamps: true, collection: 'letters'});

const Letter = mongoose.model<ILetter>('Letter', LetterSchema);

export default Letter;