import { Router, Request, Response } from 'express';
import { tenantMiddleware } from '../middleware/tenant.middleware';
import categoryRoutes from './category.routes';
import locationRoutes from './location.routes';

const router = Router();

// Todas las rutas requieren x-tenant-id (luego será JWT)
router.use(tenantMiddleware);

router.use('/categories', categoryRoutes);
router.use('/locations', locationRoutes);

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Alquilasoft API v1' });
});

export default router;