// TODO: Implement Firebase services adapter
// This file is currently disabled to avoid bundling issues

import { IServicesRepo, Service } from "@/lib/ports/services.port";

// Stub implementation - not functional
export const servicesRepoFirebase: IServicesRepo = {
  async list(): Promise<Service[]> {
    throw new Error('Firebase services adapter not implemented');
  },
  
  async create(data: Omit<Service, "id">): Promise<Service> {
    throw new Error('Firebase services adapter not implemented');
  },
  
  async update(id: string, data: Partial<Service>): Promise<void> {
    throw new Error('Firebase services adapter not implemented');
  },
  
  async updateAvailability(id: string, available: boolean): Promise<void> {
    throw new Error('Firebase services adapter not implemented');
  },
};