import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Extrae tenant_id del header x-tenant-id y lo deja en res.locals.tenantId.
 * Será reemplazado por JWT cuando se implemente autenticación.
 * Nota de Johan
 */
export const tenantMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const tenantId = req.headers['x-tenant-id'] as string | undefined;
  if (!tenantId) {
    throw new AppError('x-tenant-id header is required', 400);
  }
  if (!UUID_REGEX.test(tenantId)) {
    throw new AppError('x-tenant-id must be a valid UUID', 400);
  }
  res.locals.tenantId = tenantId;
  next();
};
