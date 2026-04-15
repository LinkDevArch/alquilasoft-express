import { prisma } from '../config/db';
import { Maintenance } from '@prisma/client';

class MaintenanceRepository {
  async findAll(tenantId: string): Promise<Maintenance[]> {
    return await prisma.maintenance.findMany({
      where: { tenantId },
      include: { item: { include: { product: true } } },
      orderBy: { scheduledDate: 'asc' },
    });
  }

  async findById(tenantId: string, id: string): Promise<Maintenance | null> {
    return await prisma.maintenance.findFirst({
      where: { id, tenantId },
      include: { item: { include: { product: true } } },
    });
  }

  async create(tenantId: string, data: any): Promise<Maintenance> {
    return await prisma.maintenance.create({
      data: { ...data, tenantId },
    });
  }

  async update(tenantId: string, id: string, data: any): Promise<Maintenance> {
    return await prisma.maintenance.update({
      where: { id, tenantId },
      data,
    });
  }

  async delete(tenantId: string, id: string): Promise<Maintenance> {
    return await prisma.maintenance.delete({
      where: { id, tenantId },
    });
  }
}

export default new MaintenanceRepository();
