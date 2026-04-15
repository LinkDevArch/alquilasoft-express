import { Router } from 'express';
import { InventoryMovementController } from '../controllers/inventory-movement.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();
const controller = new InventoryMovementController();

router.use(authMiddleware);

// INVENTORY_MANAGER: CRUD (registrar movimientos de ingreso/salida)
// TENANT_ADMIN: lectura para auditoría
// SALES_AGENT: sin acceso
router.get('/', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.getById);
router.post('/', authorizeRoles('INVENTORY_MANAGER'), controller.create);

export default router;
