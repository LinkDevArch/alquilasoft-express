import { AppError } from './AppError';

export const validateRequiredFields = (body: Record<string, any>, fields: string[]): void => {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};
