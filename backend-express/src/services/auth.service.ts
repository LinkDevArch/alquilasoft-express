import userRepository from '../repositories/user.repository';
import tenantRepository from '../repositories/tenant.repository';
import { prisma } from '../config/db';
import { hashPassword, comparePassword } from '../utils/hash';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

class AuthService {
  async onboarding(data: { tenantName: string; name: string; email: string; password: string }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear el Tenant
      const tenant = await tx.tenant.create({
        data: { name: data.tenantName },
      });

      // 2. Buscar el rol ADMIN
      const adminRole = await tx.role.findUnique({
        where: { name: 'ADMIN' },
      });

      if (!adminRole) {
        throw new AppError('Admin role not found in system. Please seed roles first.', 500);
      }

      // 3. Crear el Usuario Administrador
      const hashedPassword = await hashPassword(data.password);
      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: data.name,
          email: data.email,
          password: hashedPassword,
          roles: {
            create: {
              roleId: adminRole.id,
            },
          },
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      const token = signToken({
        userId: user.id,
        role: adminRole.name,
        tenantId: tenant.id,
      });

      return { tenant, user, token };
    });
  }

  async register(tenantId: string, data: { name: string; email: string; password: string; roleName?: string }) {
    const existing = await userRepository.findByEmail(tenantId, data.email);
    if (existing) {
      throw new AppError('User already exists for this tenant', 400);
    }

    const hashedPassword = await hashPassword(data.password);
    const roleName = data.roleName || 'SALES_AGENT'; // Rol por defecto
    const role = await userRepository.findRoleByName(roleName.toUpperCase());

    if (!role) {
      throw new AppError(`Role ${roleName} not found. Available roles: ADMIN, SALES_AGENT, INVENTORY_MANAGER`, 404);
    }

    const user = await userRepository.create(tenantId, {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      roleId: role.id,
    });

    const token = signToken({
      userId: user.id,
      role: role.name,
      tenantId: user.tenantId,
    });

    return { user, token };
  }

  async login(data: { email: string; password: string }) {
    // Busca el usuario por email en toda la base de datos (email debe ser globalmente único)
    const user = await userRepository.findByEmailGlobal(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const primaryRole = user.roles[0]?.role?.name || 'SALES_AGENT';

    const token = signToken({
      userId: user.id,
      role: primaryRole,
      tenantId: user.tenantId, 
    });

    return { user, token };
  }
}

export default new AuthService();
