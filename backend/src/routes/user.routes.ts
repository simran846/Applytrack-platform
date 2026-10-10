import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateUserProfileSchema, changePasswordSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get profile information for currently authenticated user
 *     tags: [Users]
 */
router.get('/me', UserController.getProfile);

/**
 * @openapi
 * /users/me:
 *   patch:
 *     summary: Update profile details
 *     tags: [Users]
 */
router.patch('/me', validate({ body: updateUserProfileSchema }), UserController.updateProfile);

/**
 * @openapi
 * /users/me/password:
 *   patch:
 *     summary: Change user password
 *     tags: [Users]
 */
router.patch('/me/password', validate({ body: changePasswordSchema }), UserController.changePassword);

export default router;
