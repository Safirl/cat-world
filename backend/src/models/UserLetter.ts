import mongoose, { Schema, Document, Query } from 'mongoose';
import Letter from './Letter.js';

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

type PreDeleteQueryMiddleware = Query<any, IUserLetter> & {
    _conditions: { _id: mongoose.Types.ObjectId };
};

// le middleware ne sera activé qu'en cas de suppression d'une userLetter par l'utilisateur.
UserLetterSchema.pre("findOneAndDelete", async function (this: PreDeleteQueryMiddleware, next) {
    try {
        const letter_id = this._conditions._id;
        // si tous les userLetter ont été supprimés, on supprime la lettre.
        const remainingUserLetter = await mongoose.model("UserLetter").findOne({ letter_id: letter_id })
        if (!remainingUserLetter) {
            Letter.findByIdAndDelete(letter_id);
        }
        next();
    } catch (error) {
        next(error instanceof Error ? error : new Error(String(error)));
    }
});

// le middleware sera activé en cas de la suppression d'une Letter, ou d'un User.
UserLetterSchema.pre("deleteMany", async function (this: PreDeleteQueryMiddleware, next) {
    try {
        const _id = this._conditions._id;
        // si tous les userLetter ont été supprimés, on supprime la lettre.
        const remainingUserLetter = await UserLetter.findOne({ letter_id: _id })
        if (!remainingUserLetter) {
            Letter.findByIdAndDelete(_id);
        }
        let count = await UserLetter.countDocuments({ receiver_id: _id })
        if (count > 0) {
            await UserLetter.deleteMany({ receiver_id: _id })
        }
        count = await UserLetter.countDocuments({ receiver_id: _id })
        if (count > 0) {
            await UserLetter.deleteMany({ sender_id: _id })
        }
        next();
    } catch (error) {
        next(error instanceof Error ? error : new Error(String(error)));
    }
});

const UserLetter = mongoose.model<IUserLetter>('UserLetter', UserLetterSchema);

export default UserLetter;