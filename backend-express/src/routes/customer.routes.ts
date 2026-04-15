import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();
const controller = new CustomerController();

router.use(authMiddleware);

// SALES_AGENT: CRUD completo (gestión del cliente final)
// TENANT_ADMIN: lectura para supervisión
// INVENTORY_MANAGER: sin acceso
router.get('/', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), controller.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), controller.getById);
router.post('/', authorizeRoles('SALES_AGENT'), controller.create);
router.put('/:id', authorizeRoles('SALES_AGENT'), controller.update);
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), controller.delete);

export default router;
