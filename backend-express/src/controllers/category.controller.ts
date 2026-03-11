import { Request, Response, NextFunction } from 'express';
import categoryService from '../services/category.service';

class CategoryController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const categories = await categoryService.getAllCategories(tenantId);
      res.status(200).json({ data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const id = req.params.id as string;
      const category = await categoryService.getCategoryById(tenantId, id);
      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const category = await categoryService.createCategory(tenantId, req.body);
      res.status(201).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const id = req.params.id as string;
      const category = await categoryService.updateCategory(tenantId, id, req.body);
      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = res.locals.tenantId as string;
      const id = req.params.id as string;
      await categoryService.deleteCategory(tenantId, id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();