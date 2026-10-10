import { Router } from 'express';
import {
  getAdminStats,
  getPendingProperties,
  moderateProperty,
  getReports,
} from './admin.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

// Protect all admin endpoints with authenticate and authorize('admin')
router.use(authenticate, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/properties/pending', getPendingProperties);
router.post('/properties/:id/moderate', moderateProperty);
router.get('/reports', getReports);

export default router;
