import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createRentalSchema, updateRentalSchema } from '../schemas/rental.schema';

const router = Router();
const controller = new RentalController();

router.use(authMiddleware);

router.get('/', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), controller.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), controller.getById);
router.post('/', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), validateRequest(createRentalSchema), controller.create);
router.put('/:id', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), validateRequest(updateRentalSchema), controller.update);
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), controller.delete);

export default router;
