import tenantRepository from '../repositories/tenant.repository';
import { Tenant } from '../interfaces';
import { AppError } from '../utils/AppError';

class TenantService {
  async createTenant(name: string): Promise<Tenant> {
    if (!name) {
      throw new AppError('Name is required', 400);
    }
    return await tenantRepository.create(name);
  }
}

export default new TenantService();
