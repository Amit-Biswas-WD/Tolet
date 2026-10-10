import { Router } from 'express';
import { register, login, getCurrentUser, logout, RegisterSchema, LoginSchema } from './auth.controller';
import { validateBody } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.post('/register', validateBody(RegisterSchema), register);
router.post('/login', validateBody(LoginSchema), login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);

export default router;
