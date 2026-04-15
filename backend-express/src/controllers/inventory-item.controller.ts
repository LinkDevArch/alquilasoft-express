import { Request, Response } from 'express';
import inventoryItemService from '../services/inventory-item.service';

export class InventoryItemController {
  async getAll(req: Request, res: Response) {
    const items = await inventoryItemService.getAllItems(res.locals.tenantId);
    res.status(200).json(items);
  }

  async getById(req: Request, res: Response) {
    const item = await inventoryItemService.getItemById(res.locals.tenantId, req.params.id as string);
    res.status(200).json(item);
  }

  async create(req: Request, res: Response) {
    const item = await inventoryItemService.createItem(res.locals.tenantId, req.body);
    res.status(201).json(item);
  }

  async update(req: Request, res: Response) {
    const item = await inventoryItemService.updateItem(res.locals.tenantId, req.params.id as string, req.body);
    res.status(200).json(item);
  }

  async delete(req: Request, res: Response) {
    await inventoryItemService.deleteItem(res.locals.tenantId, req.params.id as string);
    res.status(204).send();
  }
}
