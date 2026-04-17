import userRepository from '../repositories/user.repository';
import { hashPassword } from '../utils/hash';
import { AppError } from '../utils/AppError';

class UserService {
  private sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createUser(tenantId: string, data: any) {
    const roleName = data.roleName || 'SALES_AGENT';
    const role = await userRepository.findRoleByName(roleName.toUpperCase());
    if (!role) throw new AppError('Role not found. Available roles: TENANT_ADMIN, SALES_AGENT, INVENTORY_MANAGER', 404);

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create(tenantId, {
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
      roleId: role.id,
    });
    return this.sanitizeUser(user);
  }

  async getAllUsers(tenantId: string) {
    const users = await userRepository.findMany(tenantId);
    return users.map(this.sanitizeUser);
  }

  async getUserById(tenantId: string, id: string) {
    const user = await userRepository.findById(tenantId, id);
    if (!user) throw new AppError('User not found', 404);
    return this.sanitizeUser(user);
  }

  async updateUser(tenantId: string, id: string, data: any) {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }
    const user = await userRepository.update(tenantId, id, data);
    return this.sanitizeUser(user);
  }

  async deleteUser(tenantId: string, id: string) {
    const user = await userRepository.delete(tenantId, id);
    return this.sanitizeUser(user);
  }
}

export default new UserService();
