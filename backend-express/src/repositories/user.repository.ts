import { prisma } from '../config/db';
import { User, UserRole, Role } from '@prisma/client';

class UserRepository {
  async findByEmail(tenantId: string, email: string) {
    return await prisma.user.findFirst({
      where: { tenantId, email },
      include: { roles: { include: { role: true } } },
    });
  }

  async findByEmailGlobal(email: string) {
    return await prisma.user.findFirst({
      where: { email },
      include: { roles: { include: { role: true } } },
    });
  }

  async create(tenantId: string, data: { name: string; email: string; passwordHash: string; roleId: string }) {
    return await prisma.user.create({
      data: {
        tenantId,
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        roles: {
          create: {
            roleId: data.roleId,
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
  }

  async findMany(tenantId: string) {
    return await prisma.user.findMany({
      where: { tenantId },
      include: { roles: { include: { role: true } } },
    });
  }

  async findById(tenantId: string, id: string) {
    return await prisma.user.findFirst({
      where: { id, tenantId },
      include: { roles: { include: { role: true } } },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    return await prisma.user.update({
      where: { id, tenantId },
      data,
      include: { roles: { include: { role: true } } },
    });
  }

  async delete(tenantId: string, id: string) {
    return await prisma.user.delete({
      where: { id, tenantId },
    });
  }

  async findRoleByName(name: string): Promise<Role | null> {
    return await prisma.role.findUnique({
      where: { name },
    });
  }
}

export default new UserRepository();
