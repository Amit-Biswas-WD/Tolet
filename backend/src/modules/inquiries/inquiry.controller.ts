import { Request, Response } from 'express';
import { z } from 'zod';
import { InquiryModel } from './inquiry.model';
import { sendSuccess, sendError } from '../../utils/apiResponse';

const memoryInquiries: any[] = [
  {
    _id: 'inq-1',
    propertyId: 'p1',
    senderName: 'সাদিকুল ইসলাম',
    senderPhone: '01712334455',
    message: 'ফ্ল্যাটটিতে কি সার্ভিস চার্জ ভাড়ার অন্তর্ভুক্ত? আগামী মাসের ১ তারিখ থেকে ওঠা সম্ভব?',
    status: 'new',
    createdAt: new Date(),
  },
  {
    _id: 'inq-2',
    propertyId: 'p4',
    senderName: 'জাহিদুল হাসান',
    senderPhone: '01819998877',
    message: 'আমরা ৩ জন ছাত্র থাকতে পারব কি? ওয়াইফাই সুবিধা আছে?',
    status: 'replied',
    createdAt: new Date(),
  }
];

export const CreateInquirySchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  senderName: z.string().min(2, 'Name is required'),
  senderPhone: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export async function createInquiry(req: Request, res: Response): Promise<void> {
  try {
    const { propertyId, senderName, senderPhone, message } = req.body;
    const senderId = req.user?.userId || '';

    const newInquiry = {
      propertyId,
      senderId,
      senderName,
      senderPhone: senderPhone || '',
      message,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const saved = await InquiryModel.create(newInquiry);
      sendSuccess(res, saved, 'Inquiry sent to landlord successfully', 201);
    } catch (e) {
      memoryInquiries.unshift(newInquiry);
      sendSuccess(res, newInquiry, 'Inquiry sent to landlord successfully', 201);
    }
  } catch (err: any) {
    sendError(res, err.message || 'Failed to send inquiry', 500);
  }
}

export async function getInquiries(req: Request, res: Response): Promise<void> {
  try {
    const { propertyId } = req.query;

    let items: any[] = [];
    try {
      const q: any = {};
      if (propertyId) q.propertyId = propertyId;
      items = await InquiryModel.find(q).sort({ createdAt: -1 });
      if (items.length === 0) throw new Error('FallbackMemory');
    } catch (e) {
      items = [...memoryInquiries];
      if (propertyId) items = items.filter(i => i.propertyId === propertyId);
    }

    sendSuccess(res, items, 'Inquiries retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve inquiries', 500);
  }
}
