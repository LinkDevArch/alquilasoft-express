import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();

router.use(authMiddleware);

// TENANT_ADMIN: CRUD completo | SALES_AGENT e INVENTORY_MANAGER: solo lectura
router.get('/', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER'), categoryController.getAll.bind(categoryController));
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER'), categoryController.getById.bind(categoryController));
router.post('/', authorizeRoles('TENANT_ADMIN'), categoryController.create.bind(categoryController));
router.put('/:id', authorizeRoles('TENANT_ADMIN'), categoryController.update.bind(categoryController));
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), categoryController.delete.bind(categoryController));

export default router;