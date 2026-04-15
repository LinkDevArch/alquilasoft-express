import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

/**
 * Middleware para validar el token JWT y extraer la información del usuario.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Authorization: Bearer <token> required', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Guardamos la info del usuario en res.locals para que esté disponible en controladores
    res.locals.user = decoded;
    res.locals.tenantId = decoded.tenantId;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else {
      next(error);
    }
  }
};
