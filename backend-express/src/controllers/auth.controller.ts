import { Request, Response } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  async onboarding(req: Request, res: Response) {
    const { tenant, user, token } = await authService.onboarding(req.body);
    res.status(201).json({
      message: 'Tenant and Admin user created successfully',
      tenant,
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  }

  async login(req: Request, res: Response) {
    // Only pass req.body since it doesn't need tenant context
    const { user, token } = await authService.login(req.body);
    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, tenantId: user.tenantId },
      token
    });
  }
}
