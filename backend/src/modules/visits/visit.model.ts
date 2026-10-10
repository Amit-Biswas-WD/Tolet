import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
  propertyId: string;
  requesterId?: string;
  requesterName: string;
  requesterPhone: string;
  date: string;
  time: string;
  status: 'requested' | 'confirmed' | 'approved' | 'declined' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const VisitSchema = new Schema<IVisit>(
  {
    propertyId: { type: String, required: true, index: true },
    requesterId: { type: String, default: '' },
    requesterName: { type: String, required: true },
    requesterPhone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, default: '10:00' },
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'approved', 'declined', 'cancelled'],
      default: 'requested',
      index: true,
    },
  },
  { timestamps: true }
);

export const VisitModel =
  mongoose.models.Visit || mongoose.model<IVisit>('Visit', VisitSchema);
