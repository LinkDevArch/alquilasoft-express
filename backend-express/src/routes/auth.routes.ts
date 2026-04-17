import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema, onboardingSchema } from '../schemas/auth.schema';

const router = Router();
const authController = new AuthController();

router.post('/onboarding', validateRequest(onboardingSchema), authController.onboarding);

router.post('/login', validateRequest(loginSchema), authController.login);

export default router;
