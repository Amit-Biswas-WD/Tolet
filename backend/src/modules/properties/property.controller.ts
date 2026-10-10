import { Request, Response } from 'express';
import { z } from 'zod';
import { PropertyModel, IProperty } from './property.model';
import { sendSuccess, sendError } from '../../utils/apiResponse';
import { INITIAL_PROPERTIES } from '../../config/seedData';

// In-memory property cache when MongoDB is offline
let memoryProperties: any[] = [...INITIAL_PROPERTIES];

export const CreatePropertySchema = z.object({
  title: z.object({
    bn: z.string().min(3, 'Bengali title is required'),
    en: z.string().min(3, 'English title is required'),
  }),
  loc: z.string().min(2, 'Location is required'),
  sub: z.object({
    bn: z.string().default(''),
    en: z.string().default(''),
  }).optional(),
  type: z.string().min(2, 'Property type is required'),
  rent: z.number().min(1000, 'Rent must be at least 1,000 BDT'),
  beds: z.number().default(1),
  baths: z.number().default(1),
  sqft: z.number().default(0),
  furn: z.string().default('unfurn'),
  avail: z.string().default('now'),
  adv: z.number().default(2),
  amen: z.array(z.string()).default([]),
  cond: z.array(z.string()).default([]),
  floor: z.number().default(1),
  desc: z.object({
    bn: z.string(),
    en: z.string(),
  }).optional(),
  imgs: z.array(z.string()).optional(),
});

export async function getProperties(req: Request, res: Response): Promise<void> {
  try {
    const {
      loc,
      type,
      minRent,
      maxRent,
      beds,
      furn,
      search,
      feat,
      status = 'active',
      page = 1,
      limit = 20,
      sort = 'newest',
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 20;

    let items: any[] = [];
    let total = 0;

    try {
      const query: any = {};
      if (status !== 'all') query.status = status;
      if (loc && loc !== 'all') query.loc = loc;
      if (type && type !== 'all') query.type = type;
      if (furn && furn !== 'all') query.furn = furn;
      if (beds && beds !== 'all') query.beds = parseInt(beds as string, 10);
      if (feat === 'true') query.feat = true;

      if (minRent || maxRent) {
        query.rent = {};
        if (minRent) query.rent.$gte = parseInt(minRent as string, 10);
        if (maxRent) query.rent.$lte = parseInt(maxRent as string, 10);
      }

      if (search) {
        const regex = new RegExp(search as string, 'i');
        query.$or = [
          { 'title.bn': regex },
          { 'title.en': regex },
          { loc: regex },
        ];
      }

      const sortOptions: any = {};
      if (sort === 'rent_asc') sortOptions.rent = 1;
      else if (sort === 'rent_desc') sortOptions.rent = -1;
      else if (sort === 'views') sortOptions.views = -1;
      else sortOptions.createdAt = -1;

      total = await PropertyModel.countDocuments(query);
      items = await PropertyModel.find(query)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      if (items.length === 0 && total === 0) {
        // Fallback to memory properties
        throw new Error('FallbackToMemory');
      }
    } catch (e) {
      // Offline fallback: filter in-memory list
      let filtered = [...memoryProperties];
      if (status !== 'all') filtered = filtered.filter(p => p.status === status);
      if (loc && loc !== 'all') filtered = filtered.filter(p => p.loc === loc);
      if (type && type !== 'all') filtered = filtered.filter(p => p.type === type);
      if (furn && furn !== 'all') filtered = filtered.filter(p => p.furn === furn);
      if (beds && beds !== 'all') filtered = filtered.filter(p => p.beds === parseInt(beds as string, 10));
      if (feat === 'true') filtered = filtered.filter(p => p.feat);

      if (minRent) filtered = filtered.filter(p => p.rent >= parseInt(minRent as string, 10));
      if (maxRent) filtered = filtered.filter(p => p.rent <= parseInt(maxRent as string, 10));

      if (search) {
        const term = (search as string).toLowerCase();
        filtered = filtered.filter(
          p =>
            p.title.bn.toLowerCase().includes(term) ||
            p.title.en.toLowerCase().includes(term) ||
            p.loc.toLowerCase().includes(term)
        );
      }

      if (sort === 'rent_asc') filtered.sort((a, b) => a.rent - b.rent);
      else if (sort === 'rent_desc') filtered.sort((a, b) => b.rent - a.rent);
      else if (sort === 'views') filtered.sort((a, b) => (b.views || 0) - (a.views || 0));

      total = filtered.length;
      items = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    }

    sendSuccess(res, items, 'Properties fetched successfully', 200, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err: any) {
    sendError(res, err.message || 'Failed to fetch properties', 500);
  }
}

export async function getPropertyById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);

    let prop = null;
    try {
      prop = await PropertyModel.findOne({
        $or: [{ propertyId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }],
      });
      if (prop) {
        prop.views = (prop.views || 0) + 1;
        await prop.save();
      }
    } catch (e) {}

    if (!prop) {
      prop = memoryProperties.find(p => p.propertyId === id || p._id === id);
      if (prop) {
        prop.views = (prop.views || 0) + 1;
      }
    }

    if (!prop) {
      sendError(res, 'Property not found', 404);
      return;
    }

    sendSuccess(res, prop, 'Property details retrieved');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to retrieve property', 500);
  }
}

export async function createProperty(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId || 'landlord-1';
    const userName = req.user?.name || 'মোঃ রফিকুল ইসলাম';
    const userPhone = req.user?.phone || '01711223344';

    const count = memoryProperties.length + 1;
    const propertyId = `p${Date.now()}`;

    const newProp = {
      ...req.body,
      propertyId,
      owner: userId,
      landlordName: { bn: userName, en: userName },
      landlordPhone: userPhone,
      views: 0,
      inquiriesCount: 0,
      seed: Math.floor(Math.random() * 500) + 10,
      feat: false,
      status: req.user?.role === 'admin' ? 'active' : 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const created = await PropertyModel.create(newProp);
      memoryProperties.unshift(created);
      sendSuccess(res, created, 'Property submitted for moderation successfully', 201);
    } catch (e) {
      memoryProperties.unshift(newProp);
      sendSuccess(res, newProp, 'Property created successfully (cached)', 201);
    }
  } catch (err: any) {
    sendError(res, err.message || 'Failed to create property', 500);
  }
}

export async function updateProperty(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    let prop = null;
    try {
      prop = await PropertyModel.findOne({ propertyId: id });
    } catch (e) {}

    if (!prop) {
      prop = memoryProperties.find(p => p.propertyId === id);
    }

    if (!prop) {
      sendError(res, 'Property not found', 404);
      return;
    }

    // Check ownership or admin
    if (userRole !== 'admin' && prop.owner !== userId && prop.owner !== 'me') {
      sendError(res, 'Forbidden: You do not have permission to edit this listing', 403);
      return;
    }

    Object.assign(prop, req.body, { updatedAt: new Date() });
    if (prop.save) await prop.save();

    sendSuccess(res, prop, 'Property updated successfully');
  } catch (err: any) {
    sendError(res, err.message || 'Failed to update property', 500);
  }
}

export async function updatePropertyStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'pending', 'rejected', 'draft', 'suspended', 'rented'].includes(status)) {
      sendError(res, 'Invalid property status', 400);
      return;
    }

    let prop: any = null;
    try {
      prop = await PropertyModel.findOne({ propertyId: id });
      if (prop) {
        prop.status = status;
        await prop.save();
      }
    } catch (e) {}

    const memIdx = memoryProperties.findIndex(p => p.propertyId === id);
    if (memIdx !== -1) {
      memoryProperties[memIdx].status = status;
      prop = memoryProperties[memIdx];
    }

    if (!prop) {
      sendError(res, 'Property not found', 404);
      return;
    }

    sendSuccess(res, prop, `Property status updated to ${status}`);
  } catch (err: any) {
    sendError(res, err.message || 'Failed to change property status', 500);
  }
}
