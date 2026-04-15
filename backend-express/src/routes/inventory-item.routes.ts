import { Router } from 'express';
import { InventoryItemController } from '../controllers/inventory-item.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();
const controller = new InventoryItemController();

router.use(authMiddleware);

// INVENTORY_MANAGER: CRUD completo (control logístico)
// TENANT_ADMIN y SALES_AGENT: solo lectura (consultar stock disponible)
router.get('/', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER'), controller.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER'), controller.getById);
router.post('/', authorizeRoles('INVENTORY_MANAGER'), controller.create);
router.put('/:id', authorizeRoles('INVENTORY_MANAGER'), controller.update);
router.delete('/:id', authorizeRoles('TENANT_ADMIN', 'INVENTORY_MANAGER'), controller.delete);

export default router;
