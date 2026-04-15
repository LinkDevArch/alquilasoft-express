import { Request, Response } from 'express';
import productService from '../services/product.service';

export class ProductController {
  async getAll(req: Request, res: Response) {
    const products = await productService.getAllProducts(res.locals.tenantId);
    res.status(200).json(products);
  }

  async getById(req: Request, res: Response) {
    const product = await productService.getProductById(res.locals.tenantId, req.params.id as string);
    res.status(200).json(product);
  }

  async create(req: Request, res: Response) {
    const product = await productService.createProduct(res.locals.tenantId, req.body);
    res.status(201).json(product);
  }

  async update(req: Request, res: Response) {
    const product = await productService.updateProduct(res.locals.tenantId, req.params.id as string, req.body);
    res.status(200).json(product);
  }

  async delete(req: Request, res: Response) {
    await productService.deleteProduct(res.locals.tenantId, req.params.id as string);
    res.status(204).send();
  }
}
