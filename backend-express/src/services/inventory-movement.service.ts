import inventoryMovementRepository from '../repositories/inventory-movement.repository';
import { InventoryMovement } from '@prisma/client';
import { AppError } from '../utils/AppError';

class InventoryMovementService {
  async getAllMovements(tenantId: string): Promise<InventoryMovement[]> {
    return await inventoryMovementRepository.findAll(tenantId);
  }

  async getMovementById(tenantId: string, id: string): Promise<InventoryMovement> {
    const movement = await inventoryMovementRepository.findById(tenantId, id);
    if (!movement) throw new AppError('Inventory movement record not found', 404);
    return movement;
  }

  async createMovement(tenantId: string, data: any): Promise<InventoryMovement> {
    return await inventoryMovementRepository.create(tenantId, data);
  }
}

export default new InventoryMovementService();
