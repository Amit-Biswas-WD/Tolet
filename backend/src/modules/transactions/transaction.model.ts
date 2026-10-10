import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  amount: number;
  credits: number;
  type: 'purchase' | 'spend' | 'bonus' | 'refund';
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'System';
  trxId: string;
  status: 'completed' | 'pending' | 'failed';
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    type: {
      type: String,
      enum: ['purchase', 'spend', 'bonus', 'refund'],
      required: true,
    },
    method: {
      type: String,
      enum: ['bKash', 'Nagad', 'Rocket', 'Card', 'System'],
      default: 'bKash',
    },
    trxId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
      index: true,
    },
    note: { type: String },
  },
  { timestamps: true }
);

export const TransactionModel =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
