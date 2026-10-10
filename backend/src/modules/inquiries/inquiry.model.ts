import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  propertyId: string;
  senderId?: string;
  senderName: string;
  senderPhone?: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    propertyId: { type: String, required: true, index: true },
    senderId: { type: String, default: '' },
    senderName: { type: String, required: true },
    senderPhone: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'replied', 'closed'], default: 'new', index: true },
  },
  { timestamps: true }
);

export const InquiryModel =
  mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
