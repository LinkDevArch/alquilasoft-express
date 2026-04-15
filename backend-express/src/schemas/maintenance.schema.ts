import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  body: z.object({
    itemId: z.string().uuid('Invalid item ID'),
    description: z.string().min(5, 'Description is required and must be at least 5 characters'),
    scheduledDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid scheduled date'),
  }),
});

export const updateMaintenanceSchema = z.object({
  body: z.object({
    status: z.enum(['IN_PROGRESS', 'COMPLETED']),
    completedDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Invalid completion date').optional(),
  }),
});
