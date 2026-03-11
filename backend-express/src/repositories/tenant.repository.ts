import { prisma } from '../config/db';
import { Tenant } from '../interfaces';

class TenantRepository {
  async create(name: string): Promise<Tenant> {
    return await prisma.tenant.create({
      data: { name },
    });
  }
}

export default new TenantRepository();
