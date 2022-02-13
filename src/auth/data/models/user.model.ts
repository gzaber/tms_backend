import * as mongoose from 'mongoose';

export interface UserModel extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    role: string;
    isConfirmed: boolean;
}

export const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        isConfirmed: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);
