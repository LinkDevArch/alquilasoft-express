import maintenanceRepository from '../repositories/maintenance.repository';
import { Maintenance, ItemStatus, MaintenanceStatus } from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../utils/AppError';

class MaintenanceService {
  async getAllMaintenances(tenantId: string): Promise<Maintenance[]> {
    return await maintenanceRepository.findAll(tenantId);
  }

  async getMaintenanceById(tenantId: string, id: string): Promise<Maintenance> {
    const maintenance = await maintenanceRepository.findById(tenantId, id);
    if (!maintenance) throw new AppError('Maintenance record not found', 404);
    return maintenance;
  }

  async createMaintenance(tenantId: string, data: any): Promise<Maintenance> {
    const { itemId, description, scheduledDate } = data;

    return await prisma.$transaction(async (tx) => {
      const inventoryItem = await tx.inventoryItem.findFirst({
        where: { id: itemId, tenantId }
      });

      if (!inventoryItem) throw new AppError(`Item ${itemId} not found`, 404);
      if (inventoryItem.status !== ItemStatus.AVAILABLE) {
        throw new AppError(`Item ${inventoryItem.serialNumber || inventoryItem.id} cannot be placed in maintenance. Current status is ${inventoryItem.status}.`, 400);
      }

      await tx.inventoryItem.update({
        where: { id: itemId },
        data: { status: ItemStatus.MAINTENANCE }
      });

      const maintenance = await tx.maintenance.create({
        data: {
          tenantId,
          itemId,
          description,
          scheduledDate: new Date(scheduledDate),
          status: MaintenanceStatus.SCHEDULED
        }
      });

      return maintenance;
    });
  }

  async updateMaintenance(tenantId: string, id: string, data: any): Promise<Maintenance> {
    return await prisma.$transaction(async (tx) => {
      const maintenance = await tx.maintenance.findFirst({
        where: { id, tenantId }
      });

      if (!maintenance) throw new AppError('Maintenance record not found', 404);

      if (data.status === MaintenanceStatus.COMPLETED && maintenance.status !== MaintenanceStatus.COMPLETED) {
        await tx.inventoryItem.update({
          where: { id: maintenance.itemId },
          data: { status: ItemStatus.AVAILABLE }
        });

        data.completedDate = data.completedDate ? new Date(data.completedDate) : new Date();
      }

      return await tx.maintenance.update({
        where: { id },
        data
      });
    });
  }

  async deleteMaintenance(tenantId: string, id: string) {
    return await maintenanceRepository.delete(tenantId, id);
  }
}

export default new MaintenanceService();
