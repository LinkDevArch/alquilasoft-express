import { prisma } from '../config/db';
import { LocationInfo } from '../interfaces';

class LocationRepository {
  async findAll(tenantId: string): Promise<LocationInfo[]> {
    return await prisma.storageLocation.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findById(tenantId: string, id: string): Promise<LocationInfo | null> {
    return await prisma.storageLocation.findFirst({
      where: { id, tenantId },
    });
  }

  async create(tenantId: string, data: { name: string; address?: string }): Promise<LocationInfo> {
    return await prisma.storageLocation.create({
      data: {
        tenantId,
        name: data.name,
        address: data.address,
      },
    });
  }

  async update(tenantId: string, id: string, data: { name?: string; address?: string }): Promise<LocationInfo> {
    await this.ensureOwnership(tenantId, id);
    return await prisma.storageLocation.update({
      where: { id },
      data: {
        name: data.name,
        address: data.address,
      },
    });
  }

  async delete(tenantId: string, id: string): Promise<LocationInfo | null> {
    await this.ensureOwnership(tenantId, id);
    return await prisma.storageLocation.delete({
      where: { id },
    });
  }

  private async ensureOwnership(tenantId: string, id: string): Promise<void> {
    const record = await prisma.storageLocation.findFirst({ where: { id, tenantId } });
    if (!record) throw new Error('NOT_FOUND');
  }
}

export default new LocationRepository();
