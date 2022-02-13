import * as mongoose from 'mongoose';

export interface TaskModel extends mongoose.Document {
    name: string;
    description: string;
    status: string;
    dateFrom: string;
    dateTo: string;
    color: number;
    members: string[];
}

export const TaskSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, required: true },
        dateFrom: { type: Date, required: true },
        dateTo: { type: Date, required: true },
        color: { type: Number, required: true },
        members: [String]
    },
    {
        timestamps: true
    }
);
