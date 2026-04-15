import { AppError } from './AppError';

/**
 * Valida que los campos requeridos estén presentes en el body.
 * Lanza un AppError 400 si falta alguno.
 */
export const validateRequiredFields = (body: Record<string, any>, fields: string[]): void => {
  const missing = fields.filter((field) => {
    const value = body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400);
  }
};
