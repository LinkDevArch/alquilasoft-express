import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-123';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || '24h';

export interface TokenPayload {
  userId: string;
  role: string;
  tenantId: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign({ ...payload }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
