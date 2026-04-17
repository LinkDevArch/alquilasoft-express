import { Router } from 'express';
import locationController from '../controllers/location.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), locationController.getAll.bind(locationController));
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), locationController.getById.bind(locationController));
router.post('/', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), locationController.create.bind(locationController));
router.put('/:id', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), locationController.update.bind(locationController));
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), locationController.delete.bind(locationController));

export default router;