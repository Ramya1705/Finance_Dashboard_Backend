import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User';

export enum RecordType {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
}

export interface IFinancialRecord extends Document {
    amount: number;
    type: RecordType;
    category: string;
    date: Date;
    notes?: string;
    userId: Types.ObjectId | IUser;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const FinancialRecordSchema: Schema = new Schema(
    {
        amount: { type: Number, required: true },
        type: {
            type: String,
            enum: Object.values(RecordType),
            required: true,
        },
        category: { type: String, required: true },
        date: { type: Date, required: true },
        notes: { type: String, required: false },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

FinancialRecordSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete (ret as any).__v;
        return ret;
    },
});

export default mongoose.model<IFinancialRecord>('FinancialRecord', FinancialRecordSchema);
