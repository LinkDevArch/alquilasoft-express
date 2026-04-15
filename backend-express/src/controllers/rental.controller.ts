import { Request, Response } from 'express';
import rentalService from '../services/rental.service';

export class RentalController {
  async getAll(req: Request, res: Response) {
    const rentals = await rentalService.getAllRentals(res.locals.tenantId);
    res.status(200).json(rentals);
  }

  async getById(req: Request, res: Response) {
    const rental = await rentalService.getRentalById(res.locals.tenantId, req.params.id as string);
    res.status(200).json(rental);
  }

  async create(req: Request, res: Response) {
    const rental = await rentalService.createRental(res.locals.tenantId, req.body);
    res.status(201).json(rental);
  }

  async update(req: Request, res: Response) {
    const rental = await rentalService.updateRental(res.locals.tenantId, req.params.id as string, req.body);
    res.status(200).json(rental);
  }

  async delete(req: Request, res: Response) {
    await rentalService.deleteRental(res.locals.tenantId, req.params.id as string);
    res.status(204).send();
  }
}
