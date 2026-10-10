import { Request, Response } from 'express';
import { z } from 'zod';
import { WantedModel } from './wanted.model';
import { sendSuccess, sendError } from '../../utils/apiResponse';
import { INITIAL_WANTED } from '../../config/seedData';

let memoryWanted: any[] = [...INITIAL_WANTED];

export const CreateWantedSchema = z.object({
  by: z.object({
    bn: z.string().min(2),
    en: z.string().min(2),
  }),
  loc: z.string().min(2),
  type: z.string().min(2),
  min: z.number().default(0),
  max: z.number().min(1000),
  beds: z.number().default(1),
  move: z.string().default(''),
  note: z.object({
    bn: z.string().default(''),
    en: z.string().default(''),
  }).optional(),
});

export async function getWantedList(req: Request, res: Response): Promise<void> {
  try {
    const { loc, type } = req.query;

    let items: any[] = [];
    try {
      const q: any = { status: 'active' };
      if (loc && loc !== 'all') q.loc = loc;
      if (type && type !== 'all') q.type = type;
      items = await WantedModel.find(q).sort({ createdAt: -1 });
      if (!items || items.length === 0) throw new Error('FallbackMemory');
    } catch (e) {
      items = memoryWanted.filter(w => w.status === 'active');
      if (loc && loc !== 'all') items = items.filter(w => w.loc === loc);
      if (type && type !== 'all') items = items.filter(w => w.type === type);
    }

    sendSuccess(res, items, 'Wanted properties retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve wanted requests', 500);
  }
}

export async function createWanted(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'guest-user';
    const wantedId = `w${Date.now()}`;

    const newWanted = {
      ...req.body,
      wantedId,
      userId,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await WantedModel.create(newWanted);
      memoryWanted.unshift(created);
      sendSuccess(res, created, 'Wanted request posted successfully', 201);
    } catch (e) {
      memoryWanted.unshift(newWanted);
      sendSuccess(res, newWanted, 'Wanted request posted successfully (cached)', 201);
    }
  } catch (err: any) {
    sendError(res, err.message || 'Failed to post wanted request', 500);
  }
}
