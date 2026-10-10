import { Router } from 'express';
import { getWantedList, createWanted, CreateWantedSchema } from './wanted.controller';
import { authenticate } from '../../middlewares/auth';
import { validateBody } from '../../middlewares/validate';

const router = Router();

router.get('/', getWantedList);
router.post('/', authenticate, validateBody(CreateWantedSchema), createWanted);

export default router;
