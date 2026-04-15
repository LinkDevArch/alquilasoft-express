import { Request, Response } from 'express';
import customerService from '../services/customer.service';

export class CustomerController {
  async getAll(req: Request, res: Response) {
    const customers = await customerService.getAllCustomers(res.locals.tenantId);
    res.status(200).json(customers);
  }

  async getById(req: Request, res: Response) {
    const customer = await customerService.getCustomerById(res.locals.tenantId, req.params.id as string);
    res.status(200).json(customer);
  }

  async create(req: Request, res: Response) {
    const customer = await customerService.createCustomer(res.locals.tenantId, req.body);
    res.status(201).json(customer);
  }

  async update(req: Request, res: Response) {
    const customer = await customerService.updateCustomer(res.locals.tenantId, req.params.id as string, req.body);
    res.status(200).json(customer);
  }

  async delete(req: Request, res: Response) {
    await customerService.deleteCustomer(res.locals.tenantId, req.params.id as string);
    res.status(204).send();
  }
}
