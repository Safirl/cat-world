import mongoose, { Schema, Document, Query } from 'mongoose';
import UserLetter from './UserLetter.js';
import Friend from './Friend.js';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    color: string
    isAdmin: boolean
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    color: { type: String, require: false, default: "cat_texture_black.webp" },
    isAdmin: { type: Boolean, require: false }
}, { timestamps: true, collection: 'users' });

type PreDeleteQueryMiddleware = Query<any, IUser> & {
    _conditions: { _id: mongoose.Types.ObjectId };
};

UserSchema.pre("findOneAndDelete", async function (this: PreDeleteQueryMiddleware, next) {
    try {
        const userId = this._conditions._id;
        // Suppression des entrées UserLetter associées
        await UserLetter.deleteMany({
            $or: [
                { sender_id: userId },
                { receiver_id: userId }
            ]
        });

        await Friend.deleteMany({
            $or: [
                { user_id_1: userId },
                { user_id_2: userId }
            ]
        })

        next();
    } catch (error) {
        next(error instanceof Error ? error : new Error(String(error)));
    }
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;