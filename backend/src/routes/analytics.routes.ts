import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /analytics/overview:
 *   get:
 *     summary: Retrieve dashboard summary analytics, velocity, and conversion rates
 *     tags: [Analytics]
 */
router.get('/overview', AnalyticsController.getOverview);

/**
 * @openapi
 * /analytics/applications:
 *   get:
 *     summary: Retrieve detailed analytics breakdowns
 *     tags: [Analytics]
 */
router.get('/applications', AnalyticsController.getDetailed);

export default router;
