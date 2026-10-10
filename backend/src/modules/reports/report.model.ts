import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  targetType: 'property' | 'user' | 'review';
  targetId: string;
  reason: string;
  description?: string;
  reporterId: string;
  reporterName: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    targetType: {
      type: String,
      enum: ['property', 'user', 'review'],
      required: true,
    },
    targetId: { type: String, required: true, index: true },
    reason: { type: String, required: true },
    description: { type: String },
    reporterId: { type: String, required: true },
    reporterName: { type: String, default: 'Anonymous' },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

export const ReportModel =
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
