import { prisma } from '../config/db';
import { Customer } from '@prisma/client';

class CustomerRepository {
  async findAll(tenantId: string): Promise<Customer[]> {
    return await prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(tenantId: string, id: string): Promise<Customer | null> {
    return await prisma.customer.findFirst({
      where: { id, tenantId },
    });
  }

  async create(tenantId: string, data: any): Promise<Customer> {
    return await prisma.customer.create({
      data: { ...data, tenantId },
    });
  }

  async update(tenantId: string, id: string, data: any): Promise<Customer> {
    return await prisma.customer.update({
      where: { id, tenantId },
      data,
    });
  }

  async delete(tenantId: string, id: string): Promise<Customer> {
    return await prisma.customer.delete({
      where: { id, tenantId },
    });
  }
}

export default new CustomerRepository();
