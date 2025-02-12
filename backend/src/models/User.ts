import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    catColor: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    catColor: { type: String, required: false, default: "black" }
}, { timestamps: true, collection: 'users' });

const User = mongoose.model<IUser>('User', UserSchema);

export default User;