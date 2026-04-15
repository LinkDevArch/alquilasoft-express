import { Request, Response } from 'express';
import userService from '../services/user.service';

export class UserController {
  async getAll(req: Request, res: Response) {
    const users = await userService.getAllUsers(res.locals.tenantId);
    res.status(200).json(users);
  }

  async create(req: Request, res: Response) {
    const user = await userService.createUser(res.locals.tenantId, req.body);
    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, name: user.name, email: user.email }
    });
  }

  async getById(req: Request, res: Response) {
    const user = await userService.getUserById(res.locals.tenantId, req.params.id as string);
    res.status(200).json(user);
  }

  async update(req: Request, res: Response) {
    const user = await userService.updateUser(res.locals.tenantId, req.params.id as string, req.body);
    res.status(200).json(user);
  }

  async delete(req: Request, res: Response) {
    await userService.deleteUser(res.locals.tenantId, req.params.id as string);
    res.status(204).send();
  }
}
