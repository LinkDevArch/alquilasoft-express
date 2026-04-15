import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';
import tenantRoutes from './routes/tenant.routes';
import authRoutes from './routes/auth.routes';
import { testConnection } from './config/db';
import { AppError } from './utils/AppError';

dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas Públicas de Gestión de Tenants
app.use('/api/v1/tenants', tenantRoutes);

// Rutas de Autenticación (Públicas pero requieren x-tenant-id)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, // Stricter limit for auth
  message: 'Too many login attempts from this IP, please try again later.'
});
app.use('/api/v1/auth', authLimiter, authRoutes);

// Rutas Protegidas (Requieren JWT + y/o x-tenant-id)
app.use('/api/v1', routes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

// Middleware Global de Errores
app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  // JSON malformado (Content-Type: application/json pero body inválido)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON format in request body' });
    return;
  }

  // Zod validation errors should be caught by validate.middleware.ts earlier,
  // but just in case one slips through or we want to handle general ZodErrors here:
  if (err.name === 'ZodError') {
    res.status(400).json({ error: 'Validation failed', details: (err as any).errors });
    return;
  }

  // Errores de negocio con código HTTP definido
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Error de Prisma: registro no encontrado (P2025)
  if ((err as any).code === 'P2025') {
    res.status(404).json({ error: 'Record not found' });
    return;
  }

  // Error de Prisma: violación de constraint único (P2002)
  if ((err as any).code === 'P2002') {
    res.status(409).json({ error: 'A record with this value already exists' });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });