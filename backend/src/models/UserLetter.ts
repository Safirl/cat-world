import mongoose, { Schema, Document } from 'mongoose';

export interface IUserLetter extends Document {
    letter_id: string;
    user_id: string;
    state: string;
}

const UserLetterSchema: Schema = new Schema({
    letter_id: { type: String, required: true },
    user_id: { type: String, required: true },
    state: { type: String, required: true }
}, {timestamps: true, collection: 'userLetter'});

const UserLetter = mongoose.model<IUserLetter>('UserLetter', UserLetterSchema);

export default UserLetter;