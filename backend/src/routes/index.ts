import { Router } from 'express';
import authRoutes from './auth.routes';
import applicationRoutes from './application.routes';
import interviewRoutes from './interview.routes';
import analyticsRoutes from './analytics.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/interviews', interviewRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);

export default router;
