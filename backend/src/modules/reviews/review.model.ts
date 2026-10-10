import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  propertyId: string;
  userId?: string;
  comment: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    propertyId: { type: String, required: true, index: true },
    userId: { type: String, default: '' },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  },
  { timestamps: true }
);

export const ReviewModel =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
