import { Router } from 'express';
import { createInquiry, getInquiries, CreateInquirySchema } from './inquiry.controller';
import { validateBody } from '../../middlewares/validate';

const router = Router();

router.post('/', validateBody(CreateInquirySchema), createInquiry);
router.get('/', getInquiries);

export default router;
