import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();
const productController = new ProductController();

router.use(authMiddleware);

router.get('/', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER'), productController.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER'), productController.getById);
router.post('/', authorizeRoles('TENANT_ADMIN'), productController.create);
router.put('/:id', authorizeRoles('TENANT_ADMIN'), productController.update);
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), productController.delete);

export default router;
