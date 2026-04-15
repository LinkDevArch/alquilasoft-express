import inventoryItemRepository from '../repositories/inventory-item.repository';
import { InventoryItem } from '@prisma/client';
import { AppError } from '../utils/AppError';

class InventoryItemService {
  async getAllItems(tenantId: string): Promise<InventoryItem[]> {
    return await inventoryItemRepository.findAll(tenantId);
  }

  async getItemById(tenantId: string, id: string): Promise<InventoryItem> {
    const item = await inventoryItemRepository.findById(tenantId, id);
    if (!item) throw new AppError('Inventory item not found', 404);
    return item;
  }

  async createItem(tenantId: string, data: any): Promise<InventoryItem> {
    return await inventoryItemRepository.create(tenantId, data);
  }

  async updateItem(tenantId: string, id: string, data: any): Promise<InventoryItem> {
    return await inventoryItemRepository.update(tenantId, id, data);
  }

  async deleteItem(tenantId: string, id: string) {
    return await inventoryItemRepository.delete(tenantId, id);
  }
}

export default new InventoryItemService();
