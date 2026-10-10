import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createApplicationSchema,
  updateApplicationSchema,
  queryApplicationSchema
} from '../validators/application.validator';
import { z } from 'zod';
import { ApplicationStatus } from '@prisma/client';

const router = Router();

// All application routes require authentication
router.use(authenticate);

/**
 * @openapi
 * /applications:
 *   get:
 *     summary: Retrieve paginated list of user applications with filters
 *     tags: [Applications]
 */
router.get('/', validate({ query: queryApplicationSchema }), ApplicationController.getApplications);

/**
 * @openapi
 * /applications/export:
 *   get:
 *     summary: Export all applications for the current user
 *     tags: [Applications]
 */
router.get('/export', ApplicationController.exportData);

/**
 * @openapi
 * /applications:
 *   post:
 *     summary: Create a new internship application
 *     tags: [Applications]
 */
router.post('/', validate({ body: createApplicationSchema }), ApplicationController.createApplication);

/**
 * @openapi
 * /applications/{id}:
 *   get:
 *     summary: Get single application details with interviews and logs
 *     tags: [Applications]
 */
router.get('/:id', ApplicationController.getApplicationById);

/**
 * @openapi
 * /applications/{id}:
 *   patch:
 *     summary: Update application details
 *     tags: [Applications]
 */
router.patch('/:id', validate({ body: updateApplicationSchema }), ApplicationController.updateApplication);

/**
 * @openapi
 * /applications/{id}/status:
 *   patch:
 *     summary: Quick status change for application
 *     tags: [Applications]
 */
router.patch(
  '/:id/status',
  validate({
    body: z.object({
      status: z.nativeEnum(ApplicationStatus)
    })
  }),
  ApplicationController.updateStatus
);

/**
 * @openapi
 * /applications/{id}:
 *   delete:
 *     summary: Delete an internship application
 *     tags: [Applications]
 */
router.delete('/:id', ApplicationController.deleteApplication);

export default router;
