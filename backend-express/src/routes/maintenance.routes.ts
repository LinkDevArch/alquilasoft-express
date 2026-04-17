import { Router } from 'express';
import { MaintenanceController } from '../controllers/maintenance.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createMaintenanceSchema, updateMaintenanceSchema } from '../schemas/maintenance.schema';

const router = Router();
const controller = new MaintenanceController();

router.use(authMiddleware);

router.get('/', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.getById);
router.post('/', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), validateRequest(createMaintenanceSchema), controller.create);
router.put('/:id', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), validateRequest(updateMaintenanceSchema), controller.update);
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), controller.delete);

export default router;
