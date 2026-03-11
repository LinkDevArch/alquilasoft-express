import { Router } from 'express';
import locationController from '../controllers/location.controller';

const router = Router();

router.get('/', locationController.getAll.bind(locationController));
router.get('/:id', locationController.getById.bind(locationController));
router.post('/', locationController.create.bind(locationController));
router.put('/:id', locationController.update.bind(locationController));
router.delete('/:id', locationController.delete.bind(locationController));

export default router;