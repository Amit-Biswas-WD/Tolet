import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  propertyId: string;
  title: { bn: string; en: string };
  loc: string;
  sub: { bn: string; en: string };
  type: string;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  furn: string;
  avail: string;
  adv: number;
  amen: string[];
  cond: string[];
  seed: number;
  feat: boolean;
  status: 'active' | 'pending' | 'rejected' | 'draft' | 'suspended' | 'rented';
  owner: string;
  landlordName: { bn: string; en: string };
  landlordPhone: string;
  views: number;
  inquiriesCount: number;
  floor: number;
  desc?: { bn: string; en: string };
  imgs?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    propertyId: { type: String, required: true, unique: true, index: true },
    title: {
      bn: { type: String, required: true },
      en: { type: String, required: true },
    },
    loc: { type: String, required: true, index: true },
    sub: {
      bn: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    type: { type: String, required: true, index: true },
    rent: { type: Number, required: true, index: true },
    beds: { type: Number, default: 1 },
    baths: { type: Number, default: 1 },
    sqft: { type: Number, default: 0 },
    furn: { type: String, default: 'unfurn' },
    avail: { type: String, default: 'now' },
    adv: { type: Number, default: 2 },
    amen: [{ type: String }],
    cond: [{ type: String }],
    seed: { type: Number, default: 100 },
    feat: { type: Boolean, default: false, index: true },
    status: {
      type: String,
      enum: ['active', 'pending', 'rejected', 'draft', 'suspended', 'rented'],
      default: 'active',
      index: true,
    },
    owner: { type: String, default: 'admin' },
    landlordName: {
      bn: { type: String, default: 'মোঃ রফিকুল ইসলাম' },
      en: { type: String, default: 'Md. Rafiqul Islam' },
    },
    landlordPhone: { type: String, default: '01711000000' },
    views: { type: Number, default: 0 },
    inquiriesCount: { type: Number, default: 0 },
    floor: { type: Number, default: 1 },
    desc: {
      bn: { type: String },
      en: { type: String },
    },
    imgs: [{ type: String }],
  },
  { timestamps: true }
);

PropertySchema.index({ loc: 1, type: 1, rent: 1 });

export const PropertyModel =
  mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
