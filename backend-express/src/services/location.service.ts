import locationRepository from '../repositories/location.repository';
import { LocationInfo } from '../interfaces';
import { AppError } from '../utils/AppError';

class LocationService {
  async getAllLocations(tenantId: string): Promise<LocationInfo[]> {
    return await locationRepository.findAll(tenantId);
  }

  async getLocationById(tenantId: string, id: string): Promise<LocationInfo> {
    const location = await locationRepository.findById(tenantId, id);
    if (!location) {
      throw new AppError('Location not found', 404);
    }
    return location;
  }

  async createLocation(tenantId: string, data: { name: string; address?: string }): Promise<LocationInfo> {
    if (!data.name) {
      throw new AppError('Name is required', 400);
    }
    return await locationRepository.create(tenantId, data);
  }

  async updateLocation(tenantId: string, id: string, data: { name?: string; address?: string }): Promise<LocationInfo> {
    const existing = await locationRepository.findById(tenantId, id);
    if (!existing) {
      throw new AppError('Location not found', 404);
    }
    return await locationRepository.update(tenantId, id, data);
  }

  async deleteLocation(tenantId: string, id: string): Promise<LocationInfo> {
    const existing = await locationRepository.findById(tenantId, id);
    if (!existing) {
      throw new AppError('Location not found', 404);
    }
    const deleted = await locationRepository.delete(tenantId, id);
    if (!deleted) {
      throw new AppError('Location not found', 404);
    }
    return deleted;
  }
}

export default new LocationService();