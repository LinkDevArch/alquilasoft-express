import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.get('/', authorizeRoles('TENANT_ADMIN'), userController.getAll);
router.post('/', authorizeRoles('TENANT_ADMIN'), userController.create);
router.get('/:id', authorizeRoles('TENANT_ADMIN'), userController.getById);
router.put('/:id', authorizeRoles('TENANT_ADMIN'), userController.update);
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), userController.delete);

export default router;
