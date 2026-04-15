import { Request, Response } from 'express';
import inventoryMovementService from '../services/inventory-movement.service';

export class InventoryMovementController {
  async getAll(req: Request, res: Response) {
    const movements = await inventoryMovementService.getAllMovements(res.locals.tenantId);
    res.status(200).json(movements);
  }

  async getById(req: Request, res: Response) {
    const movement = await inventoryMovementService.getMovementById(res.locals.tenantId, req.params.id as string);
    res.status(200).json(movement);
  }

  async create(req: Request, res: Response) {
    const movement = await inventoryMovementService.createMovement(res.locals.tenantId, req.body);
    res.status(201).json(movement);
  }
}
