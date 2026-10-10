import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  role: 'tenant' | 'landlord' | 'admin';
  status: 'active' | 'suspended';
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, sparse: true, index: true },
    email: { type: String, sparse: true, index: true },
    password: { type: String },
    role: { type: String, enum: ['tenant', 'landlord', 'admin'], default: 'tenant' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    credits: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
