import { prisma } from '../config/db';
import { InventoryMovement } from '@prisma/client';

class InventoryMovementRepository {
  async findAll(tenantId: string): Promise<InventoryMovement[]> {
    return await prisma.inventoryMovement.findMany({
      where: { tenantId },
      include: { item: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string): Promise<InventoryMovement | null> {
    return await prisma.inventoryMovement.findFirst({
      where: { id, tenantId },
      include: { item: { include: { product: true } } },
    });
  }

  async create(tenantId: string, data: any): Promise<InventoryMovement> {
    return await prisma.inventoryMovement.create({
      data: { ...data, tenantId },
    });
  }
}

export default new InventoryMovementRepository();
