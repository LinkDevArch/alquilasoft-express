import { prisma } from '../config/db';
import { Product } from '../interfaces';

class ProductRepository {
  async findAll(tenantId: string): Promise<Product[]> {
    return await prisma.product.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { id: 'desc' },
    });
  }

  async findById(tenantId: string, id: string): Promise<Product | null> {
    return await prisma.product.findFirst({
      where: { id, tenantId },
      include: { category: true },
    });
  }

  async create(tenantId: string, data: { name: string; description?: string; categoryId: string; priceInCents: number; trackingType?: 'SERIALIZED' | 'BULK' }): Promise<Product> {
    return await prisma.product.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        priceInCents: data.priceInCents,
        trackingType: data.trackingType ?? 'SERIALIZED',
      },
    });
  }

  async update(tenantId: string, id: string, data: any): Promise<Product> {
    return await prisma.product.update({
      where: { id, tenantId },
      data,
    });
  }

  async delete(tenantId: string, id: string): Promise<Product | null> {
    return await prisma.product.delete({
      where: { id, tenantId },
    });
  }
}

export default new ProductRepository();
