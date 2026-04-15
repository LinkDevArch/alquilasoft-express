import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-123';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || '24h';

export interface TokenPayload {
  userId: string;
  role: string;
  tenantId: string;
}

/**
 * Genera un JWT válido con el payload requerido.
 */
export const signToken = (payload: TokenPayload): string => {
  return jwt.sign({ ...payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verifica la validez de un JWT.
 */
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
