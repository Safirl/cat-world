import mongoose, { Schema, Document } from 'mongoose';

export interface IFriend extends Document {
    user_id_1: mongoose.Types.ObjectId,
    user_id_2: mongoose.Types.ObjectId,
}

const FriendSchema: Schema = new Schema({
    user_id_1: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    user_id_2: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
}, {timestamps: true, collection: 'friends'});

const Friend = mongoose.model<IFriend>('Friend', FriendSchema);

export default Friend;