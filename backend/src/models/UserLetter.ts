import mongoose, { Schema, Document } from 'mongoose';

export interface IUserLetter extends Document {
    letter_id: string;
    receiver_id: string;
    sender_id: string;
    read: boolean;
}

const UserLetterSchema: Schema = new Schema({
    letter_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    read: { type: Boolean, required: true, default: false }
}, { timestamps: true, collection: 'userLetter' });

const UserLetter = mongoose.model<IUserLetter>('UserLetter', UserLetterSchema);

export default UserLetter;