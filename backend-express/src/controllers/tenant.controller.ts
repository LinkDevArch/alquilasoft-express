import { Request, Response, NextFunction } from 'express';
import tenantService from '../services/tenant.service';

class TenantController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await tenantService.createTenant(req.body.name);
      res.status(201).json({ data: tenant });
    } catch (error) {
      next(error);
    }
  }
}

export default new TenantController();
