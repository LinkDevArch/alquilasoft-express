import { Router } from 'express';
import { RentalController } from '../controllers/rental.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { authorizeRoles } from '../middleware/role.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createRentalSchema, updateRentalSchema } from '../schemas/rental.schema';

const router = Router();
const controller = new RentalController();

router.use(authMiddleware);

// SALES_AGENT: CRUD completo (crear alquileres, registrar devoluciones)
// TENANT_ADMIN: lectura y eliminación para supervisión
// INVENTORY_MANAGER: sin acceso
router.get('/', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), controller.getAll);
router.get('/:id', authorizeRoles('TENANT_ADMIN', 'SALES_AGENT'), controller.getById);
router.post('/', authorizeRoles('SALES_AGENT'), validateRequest(createRentalSchema), controller.create);
router.put('/:id', authorizeRoles('SALES_AGENT'), validateRequest(updateRentalSchema), controller.update);
router.delete('/:id', authorizeRoles('TENANT_ADMIN'), controller.delete);

export default router;
