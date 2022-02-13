import * as mongoose from 'mongoose';

export interface EmailModel extends mongoose.Document {
    email: string;
    role: string;
    hasUser: boolean;
}

export const EmailSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true },
        hasUser: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);
