import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  CreatePropertySchema,
} from './property.controller';
import { authenticate, authorize } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';

const router = Router();

router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/', authenticate, authorize('landlord', 'admin'), validateBody(CreatePropertySchema), createProperty);
router.put('/:id', authenticate, authorize('landlord', 'admin'), updateProperty);
router.patch('/:id/status', authenticate, authorize('landlord', 'admin'), updatePropertyStatus);

export default router;
