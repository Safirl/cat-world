import mongoose, { Schema, Document } from 'mongoose';

export interface IFriend extends Document {
    username: string;
    email: string;
    password: string;
}

const FriendSchema: Schema = new Schema({
    user_id_1: { type: String, required: true },
    user_id_2: { type: String, required: true },
}, {timestamps: true, collection: 'friends'});

const Friend = mongoose.model<IFriend>('Friend', FriendSchema);

export default Friend;