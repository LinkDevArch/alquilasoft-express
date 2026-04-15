import { prisma } from '../config/db';
import { InventoryItem } from '@prisma/client';

class InventoryItemRepository {
  async findAll(tenantId: string): Promise<InventoryItem[]> {
    return await prisma.inventoryItem.findMany({
      where: { tenantId },
      include: { product: true, location: true },
    });
  }

  async findById(tenantId: string, id: string): Promise<InventoryItem | null> {
    return await prisma.inventoryItem.findFirst({
      where: { id, tenantId },
      include: { product: true, location: true },
    });
  }

  async create(tenantId: string, data: any): Promise<InventoryItem> {
    return await prisma.inventoryItem.create({
      data: { ...data, tenantId },
    });
  }

  async update(tenantId: string, id: string, data: any): Promise<InventoryItem> {
    return await prisma.inventoryItem.update({
      where: { id, tenantId },
      data,
    });
  }

  async delete(tenantId: string, id: string): Promise<InventoryItem> {
    return await prisma.inventoryItem.delete({
      where: { id, tenantId },
    });
  }
}

export default new InventoryItemRepository();
