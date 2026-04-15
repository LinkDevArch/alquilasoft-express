import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Middleware para validar el rol del usuario (RBAC).
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = res.locals.user?.role;

    if (!userRole) {
      return next(new AppError('No role identified for user', 403));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new AppError('Access denied: You do not have the required permissions', 403));
    }

    next();
  };
};
