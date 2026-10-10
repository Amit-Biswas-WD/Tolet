import { Router } from 'express';
import { createVisit, getVisits, updateVisitStatus, CreateVisitSchema } from './visit.controller';
import { validateBody } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.post('/', validateBody(CreateVisitSchema), createVisit);
router.get('/', getVisits);
router.patch('/:id/status', authenticate, updateVisitStatus);

export default router;
