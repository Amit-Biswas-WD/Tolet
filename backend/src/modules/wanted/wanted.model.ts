import mongoose, { Schema, Document } from 'mongoose';

export interface IWanted extends Document {
  wantedId: string;
  by: { bn: string; en: string };
  userId: string;
  loc: string;
  type: string;
  min: number;
  max: number;
  beds: number;
  move: string;
  note: { bn: string; en: string };
  status: 'active' | 'pending' | 'removed';
  createdAt: Date;
  updatedAt: Date;
}

const WantedSchema = new Schema<IWanted>(
  {
    wantedId: { type: String, required: true, unique: true, index: true },
    by: {
      bn: { type: String, required: true },
      en: { type: String, required: true },
    },
    userId: { type: String, default: '' },
    loc: { type: String, required: true, index: true },
    type: { type: String, required: true, index: true },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    beds: { type: Number, default: 1 },
    move: { type: String, default: '' },
    note: {
      bn: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'removed'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

export const WantedModel =
  mongoose.models.Wanted || mongoose.model<IWanted>('Wanted', WantedSchema);
