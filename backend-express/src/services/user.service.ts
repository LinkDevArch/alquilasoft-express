import userRepository from '../repositories/user.repository';
import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/AppError';

class UserService {
  async createUser(tenantId: string, data: any) {
    const roleName = data.roleName || 'SALES_AGENT';
    const role = await userRepository.findRoleByName(roleName.toUpperCase());
    if (!role) throw new AppError('Role not found. Available roles: TENANT_ADMIN, SALES_AGENT, INVENTORY_MANAGER', 404);

    const hashedPassword = await hashPassword(data.password);
    return await userRepository.create(tenantId, {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      roleId: role.id,
    });
  }

  async getAllUsers(tenantId: string) {
    return await userRepository.findMany(tenantId);
  }

  async getUserById(tenantId: string, id: string) {
    const user = await userRepository.findById(tenantId, id);
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateUser(tenantId: string, id: string, data: any) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    return await userRepository.update(tenantId, id, data);
  }

  async deleteUser(tenantId: string, id: string) {
    return await userRepository.delete(tenantId, id);
  }
}

export default new UserService();
