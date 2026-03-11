import { Router } from 'express';
import tenantController from '../controllers/tenant.controller';

const router = Router();

router.post('/', tenantController.create.bind(tenantController));

export default router;
