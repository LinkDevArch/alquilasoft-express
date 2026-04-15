import customerRepository from '../repositories/customer.repository';
import { Customer } from '@prisma/client';
import { AppError } from '../utils/AppError';

class CustomerService {
  async getAllCustomers(tenantId: string): Promise<Customer[]> {
    return await customerRepository.findAll(tenantId);
  }

  async getCustomerById(tenantId: string, id: string): Promise<Customer> {
    const customer = await customerRepository.findById(tenantId, id);
    if (!customer) throw new AppError('Customer not found', 404);
    return customer;
  }

  async createCustomer(tenantId: string, data: any): Promise<Customer> {
    return await customerRepository.create(tenantId, data);
  }

  async updateCustomer(tenantId: string, id: string, data: any): Promise<Customer> {
    return await customerRepository.update(tenantId, id, data);
  }

  async deleteCustomer(tenantId: string, id: string) {
    return await customerRepository.delete(tenantId, id);
  }
}

export default new CustomerService();
