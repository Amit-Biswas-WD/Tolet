import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import propertyRoutes from '../modules/properties/property.routes';
import wantedRoutes from '../modules/wanted/wanted.routes';
import inquiryRoutes from '../modules/inquiries/inquiry.routes';
import visitRoutes from '../modules/visits/visit.routes';
import adminRoutes from '../modules/admin/admin.routes';
import { sendSuccess } from '../utils/apiResponse';

const router = Router();

router.get('/health', (req, res) => {
  sendSuccess(res, {
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'ToLet.com Backend REST API',
    version: '1.0.0',
    region: 'Dhaka, Bangladesh',
  }, 'API is operational');
});

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/wanted', wantedRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/visits', visitRoutes);
router.use('/admin', adminRoutes);

export default router;
