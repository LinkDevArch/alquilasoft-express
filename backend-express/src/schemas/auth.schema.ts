import { z } from 'zod';

export const onboardingSchema = z.object({
  body: z.object({
    tenantName: z.string().min(2, 'Tenant name must be at least 2 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    roleName: z.enum(['TENANT_ADMIN', 'SALES_AGENT', 'INVENTORY_MANAGER']).optional(),
  }),
});
