import productRepository from '../repositories/product.repository';
import { Product } from '../interfaces';
import { AppError } from '../utils/AppError';

class ProductService {
  async getAllProducts(tenantId: string): Promise<Product[]> {
    return await productRepository.findAll(tenantId);
  }

  async getProductById(tenantId: string, id: string): Promise<Product> {
    const product = await productRepository.findById(tenantId, id);
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  async createProduct(tenantId: string, data: any): Promise<Product> {
    return await productRepository.create(tenantId, data);
  }

  async updateProduct(tenantId: string, id: string, data: any): Promise<Product> {
    return await productRepository.update(tenantId, id, data);
  }

  async deleteProduct(tenantId: string, id: string) {
    return await productRepository.delete(tenantId, id);
  }
}

export default new ProductService();
