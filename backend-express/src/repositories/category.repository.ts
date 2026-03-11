import { prisma } from '../config/db';
import { Category } from '../interfaces';

class CategoryRepository {
  async findAll(tenantId: string): Promise<Category[]> {
    return await prisma.productCategory.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findById(tenantId: string, id: string): Promise<Category | null> {
    return await prisma.productCategory.findFirst({
      where: { id, tenantId },
    });
  }

  async create(tenantId: string, data: { name: string; description?: string; slug: string }): Promise<Category> {
    return await prisma.productCategory.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        slug: data.slug,
      },
    });
  }

  async update(tenantId: string, id: string, data: { name?: string; description?: string; slug?: string }): Promise<Category> {
    await this.ensureOwnership(tenantId, id);
    return await prisma.productCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        slug: data.slug,
      },
    });
  }

  async delete(tenantId: string, id: string): Promise<Category | null> {
    await this.ensureOwnership(tenantId, id);
    return await prisma.productCategory.delete({
      where: { id },
    });
  }

  private async ensureOwnership(tenantId: string, id: string): Promise<void> {
    const record = await prisma.productCategory.findFirst({ where: { id, tenantId } });
    if (!record) throw new Error('NOT_FOUND');
  }
}

export default new CategoryRepository();
