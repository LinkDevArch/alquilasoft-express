import { Request, Response, NextFunction } from 'express';
import locationService from '../services/location.service';

class LocationController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const locations = await locationService.getAllLocations(tenantId);
      res.status(200).json({ data: locations });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const id = req.params.id as string;
      const location = await locationService.getLocationById(tenantId, id);
      res.status(200).json({ data: location });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const location = await locationService.createLocation(tenantId, req.body);
      res.status(201).json({ data: location });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const id = req.params.id as string;
      const location = await locationService.updateLocation(tenantId, id, req.body);
      res.status(200).json({ data: location });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const id = req.params.id as string;
      await locationService.deleteLocation(tenantId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new LocationController();