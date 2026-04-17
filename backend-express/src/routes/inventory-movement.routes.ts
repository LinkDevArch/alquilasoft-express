import { Router } from 'express';
import { InventoryMovementController } from '../controllers/inventory-movement.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();
const controller = new InventoryMovementController();

router.use(authMiddleware);

router.get('/', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.getById);
router.post('/', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.create);

export default router;
