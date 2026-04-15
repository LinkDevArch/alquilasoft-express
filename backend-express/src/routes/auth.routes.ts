import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema, onboardingSchema } from '../schemas/auth.schema';

const router = Router();
const authController = new AuthController();

// Onboarding: Crea Tenant + Admin de una sola vez (100% público)
router.post('/onboarding', validateRequest(onboardingSchema), authController.onboarding);

// Login: Solo requiere email y password
router.post('/login', validateRequest(loginSchema), authController.login);

export default router;
