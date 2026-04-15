import { prisma } from '../config/db';
import { Rental } from '@prisma/client';

class RentalRepository {
  async findAll(tenantId: string): Promise<Rental[]> {
    return await prisma.rental.findMany({
      where: { tenantId },
      include: { customer: true, items: { include: { item: { include: { product: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string): Promise<Rental | null> {
    return await prisma.rental.findFirst({
      where: { id, tenantId },
      include: { customer: true, items: { include: { item: { include: { product: true } } } } },
    });
  }

  async create(tenantId: string, data: any): Promise<Rental> {
    const { rentalItems, ...rentalData } = data;
    return await prisma.rental.create({
      data: {
        ...rentalData,
        tenantId,
        items: {
          create: rentalItems,
        },
      },
    });
  }

  async update(tenantId: string, id: string, data: any): Promise<Rental> {
    return await prisma.rental.update({
      where: { id, tenantId },
      data,
    });
  }

  async delete(tenantId: string, id: string): Promise<Rental> {
    return await prisma.rental.delete({
      where: { id, tenantId },
    });
  }
}

export default new RentalRepository();
