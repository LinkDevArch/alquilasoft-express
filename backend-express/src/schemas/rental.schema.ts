import { z } from 'zod';

export const createRentalSchema = z.object({
  body: z.object({
    customerId: z.string().uuid('Invalid customer ID'),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end date'),
    items: z.array(z.object({
      itemId: z.string().uuid('Invalid item ID'),
      quantity: z.number().int().positive('Quantity must be positive'),
    })).min(1, 'At least one item is required'),
  }),
});

export const updateRentalSchema = z.object({
  body: z.object({
    status: z.enum(['ACTIVE', 'PARTIAL_RETURN', 'RETURNED', 'CANCELLED']).optional(),
    endDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid end date').optional(),
  }),
});
