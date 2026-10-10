import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createInterviewSchema, updateInterviewSchema } from '../validators/interview.validator';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /interviews:
 *   get:
 *     summary: Retrieve all scheduled interviews for user
 *     tags: [Interviews]
 */
router.get('/', InterviewController.getInterviews);

/**
 * @openapi
 * /interviews/{id}:
 *   get:
 *     summary: Get specific interview details
 *     tags: [Interviews]
 */
router.get('/:id', InterviewController.getInterviewById);

/**
 * @openapi
 * /interviews:
 *   post:
 *     summary: Schedule a new interview round
 *     tags: [Interviews]
 */
router.post('/', validate({ body: createInterviewSchema }), InterviewController.createInterview);

/**
 * @openapi
 * /interviews/{id}:
 *   patch:
 *     summary: Update interview notes or schedule
 *     tags: [Interviews]
 */
router.patch('/:id', validate({ body: updateInterviewSchema }), InterviewController.updateInterview);

/**
 * @openapi
 * /interviews/{id}:
 *   delete:
 *     summary: Delete an interview entry
 *     tags: [Interviews]
 */
router.delete('/:id', InterviewController.deleteInterview);

export default router;
