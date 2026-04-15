import { Request, Response } from 'express';
import maintenanceService from '../services/maintenance.service';

export class MaintenanceController {
  async getAll(req: Request, res: Response) {
    const records = await maintenanceService.getAllMaintenances(res.locals.tenantId);
    res.status(200).json(records);
  }

  async getById(req: Request, res: Response) {
    const record = await maintenanceService.getMaintenanceById(res.locals.tenantId, req.params.id as string);
    res.status(200).json(record);
  }

  async create(req: Request, res: Response) {
    const record = await maintenanceService.createMaintenance(res.locals.tenantId, req.body);
    res.status(201).json(record);
  }

  async update(req: Request, res: Response) {
    const record = await maintenanceService.updateMaintenance(res.locals.tenantId, req.params.id as string, req.body);
    res.status(200).json(record);
  }

  async delete(req: Request, res: Response) {
    await maintenanceService.deleteMaintenance(res.locals.tenantId, req.params.id as string);
    res.status(204).send();
  }
}
