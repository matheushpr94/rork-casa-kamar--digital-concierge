export type Service = { 
  id: string; 
  name: string; 
  description?: string; 
  price?: number; 
  durationMin?: number; 
  available?: boolean; 
};

export interface IServicesRepo {
  list(): Promise<Service[]>;
  create(data: Omit<Service, "id">): Promise<Service>;
  updateAvailability(id: string, available: boolean): Promise<void>;
}