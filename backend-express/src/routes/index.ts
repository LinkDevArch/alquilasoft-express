import { Router, Request, Response } from 'express';
import categoryRoutes from './category.routes';
import locationRoutes from './location.routes';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import customerRoutes from './customer.routes';
import inventoryItemRoutes from './inventory-item.routes';
import rentalRoutes from './rental.routes';
import maintenanceRoutes from './maintenance.routes';
import inventoryMovementRoutes from './inventory-movement.routes';

const router = Router();

// Todas estas rutas están protegidas internamente por su propio authMiddleware y roleMiddleware
router.use('/categories', categoryRoutes);
router.use('/locations', locationRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/inventory-items', inventoryItemRoutes);
router.use('/rentals', rentalRoutes);
router.use('/maintenances', maintenanceRoutes);
router.use('/inventory-movements', inventoryMovementRoutes);

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Alquilasoft API v1' });
});

export default router;