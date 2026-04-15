import rentalRepository from '../repositories/rental.repository';
import { Rental, ItemStatus } from '@prisma/client';
import { prisma } from '../config/db';
import { AppError } from '../utils/AppError';

class RentalService {
  async getAllRentals(tenantId: string): Promise<Rental[]> {
    return await rentalRepository.findAll(tenantId);
  }

  async getRentalById(tenantId: string, id: string): Promise<Rental> {
    const rental = await rentalRepository.findById(tenantId, id);
    if (!rental) throw new AppError('Rental not found', 404);
    return rental;
  }

  async createRental(tenantId: string, data: any): Promise<Rental> {
    const { customerId, endDate, items } = data;

    return await prisma.$transaction(async (tx) => {
      let totalInCents = 0;
      const rentalItemsToCreate = [];

      for (const reqItem of items) {
        const inventoryItem = await tx.inventoryItem.findFirst({
          where: { id: reqItem.itemId, tenantId },
          include: { product: true }
        });

        if (!inventoryItem) throw new AppError(`Item ${reqItem.itemId} not found`, 404);
        if (inventoryItem.status !== ItemStatus.AVAILABLE) {
          throw new AppError(`Item ${inventoryItem.serialNumber || inventoryItem.id} is not available for rent. Current status: ${inventoryItem.status}`, 400);
        }

        const priceInCents = inventoryItem.product.priceInCents * reqItem.quantity;
        totalInCents += priceInCents;

        rentalItemsToCreate.push({
          itemId: reqItem.itemId,
          quantity: reqItem.quantity,
          priceInCents
        });

        // Update item status to RENTED
        await tx.inventoryItem.update({
          where: { id: reqItem.itemId },
          data: { status: ItemStatus.RENTED }
        });
      }

      const rental = await tx.rental.create({
        data: {
          tenantId,
          customerId,
          endDate: new Date(endDate),
          totalInCents,
          items: {
            create: rentalItemsToCreate
          }
        },
        include: { items: true }
      });

      return rental;
    });
  }

  async updateRental(tenantId: string, id: string, data: any): Promise<Rental> {
    // If status changes to RETURNED, we should ideally mark items as AVAILABLE
    // For now we just allow standard update
    return await rentalRepository.update(tenantId, id, data);
  }

  async deleteRental(tenantId: string, id: string) {
    return await rentalRepository.delete(tenantId, id);
  }
}

export default new RentalService();
