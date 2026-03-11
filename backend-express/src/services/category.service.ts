import categoryRepository from '../repositories/category.repository';
import { Category } from '../interfaces';
import { AppError } from '../utils/AppError';

class CategoryService {
  async getAllCategories(tenantId: string): Promise<Category[]> {
    return await categoryRepository.findAll(tenantId);
  }

  async getCategoryById(tenantId: string, id: string): Promise<Category> {
    const category = await categoryRepository.findById(tenantId, id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async createCategory(tenantId: string, data: { name: string; description?: string; slug?: string }): Promise<Category> {
    if (!data.name) {
      throw new AppError('Name is required', 400);
    }
    const slug = data.slug ?? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return await categoryRepository.create(tenantId, { ...data, slug });
  }

  async updateCategory(tenantId: string, id: string, data: { name?: string; description?: string; slug?: string }): Promise<Category> {
    const existing = await categoryRepository.findById(tenantId, id);
    if (!existing) {
      throw new AppError('Category not found', 404);
    }
    const slug = data.slug ?? (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : undefined);
    return await categoryRepository.update(tenantId, id, { ...data, slug });
  }

  async deleteCategory(tenantId: string, id: string): Promise<Category> {
    const existing = await categoryRepository.findById(tenantId, id);
    if (!existing) {
      throw new AppError('Category not found', 404);
    }
    const deleted = await categoryRepository.delete(tenantId, id);
    if (!deleted) {
      throw new AppError('Category not found', 404);
    }
    return deleted;
  }
}

export default new CategoryService();