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

app.use(helmet());
app.use(cors());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/tenants', tenantRoutes);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login attempts from this IP, please try again later.'
});
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1', routes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP' });
});

app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON format in request body' });
    return;
  }

  if (err.name === 'ZodError') {
    res.status(400).json({ error: 'Validation failed', details: (err as any).errors });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if ((err as any).code === 'P2025') {
    res.status(404).json({ error: 'Record not found' });
    return;
  }
  if ((err as any).code === 'P2002') {
    res.status(409).json({ error: 'A record with this value already exists' });
    return;
  }
  if ((err as any).code === 'P2003') {
    res.status(409).json({ error: 'Foreign key constraint violated: The related record does not exist or the record is currently in use.' });
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