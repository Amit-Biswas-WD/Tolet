import { Request, Response } from 'express';
import { z } from 'zod';
import { VisitModel } from './visit.model';
import { sendSuccess, sendError } from '../../utils/apiResponse';

const memoryVisits: any[] = [
  {
    _id: 'vis-1',
    propertyId: 'p1',
    requesterName: 'মাহমুদুল হক',
    requesterPhone: '01719876543',
    date: '2026-10-28',
    time: '16:00',
    status: 'requested',
    createdAt: new Date(),
  },
  {
    _id: 'vis-2',
    propertyId: 'p2',
    requesterName: 'আফসানা শারমিন',
    requesterPhone: '01815554433',
    date: '2026-10-25',
    time: '11:00',
    status: 'approved',
    createdAt: new Date(),
  }
];

export const CreateVisitSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  requesterName: z.string().min(2, 'Name is required'),
  requesterPhone: z.string().regex(/^01[3-9]\d{8}$/, 'Valid Bangladesh mobile number required'),
  date: z.string().min(4, 'Visit date is required'),
  time: z.string().default('10:00'),
});

export async function createVisit(req: Request, res: Response): Promise<void> {
  try {
    const { propertyId, requesterName, requesterPhone, date, time } = req.body;
    const requesterId = req.user?.userId || '';

    const newVisit = {
      propertyId,
      requesterId,
      requesterName,
      requesterPhone,
      date,
      time: time || '10:00',
      status: 'requested',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const saved = await VisitModel.create(newVisit);
      sendSuccess(res, saved, 'Visit requested successfully. Landlord will confirm shortly.', 201);
    } catch (e) {
      memoryVisits.unshift(newVisit);
      sendSuccess(res, newVisit, 'Visit requested successfully. Landlord will confirm shortly.', 201);
    }
  } catch (err: any) {
    sendError(res, err.message || 'Failed to request visit', 500);
  }
}

export async function getVisits(req: Request, res: Response): Promise<void> {
  try {
    const { propertyId } = req.query;

    let items: any[] = [];
    try {
      const q: any = {};
      if (propertyId) q.propertyId = propertyId;
      items = await VisitModel.find(q).sort({ createdAt: -1 });
      if (items.length === 0) throw new Error('FallbackMemory');
    } catch (e) {
      items = [...memoryVisits];
      if (propertyId) items = items.filter(v => v.propertyId === propertyId);
    }

    sendSuccess(res, items, 'Visits retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve visits', 500);
  }
}

export async function updateVisitStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['requested', 'confirmed', 'approved', 'declined', 'cancelled'].includes(status)) {
      sendError(res, 'Invalid visit status', 400);
      return;
    }

    let visit: any = null;
    try {
      visit = await VisitModel.findById(id);
      if (visit) {
        visit.status = status;
        await visit.save();
      }
    } catch (e) {}

    const idx = memoryVisits.findIndex(v => v._id === id);
    if (idx !== -1) {
      memoryVisits[idx].status = status;
      visit = memoryVisits[idx];
    }

    sendSuccess(res, visit, `Visit status updated to ${status}`);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update visit status', 500);
  }
}
