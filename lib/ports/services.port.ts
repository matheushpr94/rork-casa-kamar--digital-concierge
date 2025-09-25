export type ServiceVariant = {
  id: string;
  name: string;
  price: number;
};

export type Service = { 
  id: string; 
  name: string; 
  description?: string; 
  price?: number; 
  durationMin?: number; 
  available?: boolean;
  active?: boolean;
  order?: number;
  variants?: ServiceVariant[];
};

export interface IServicesRepo {
  list(): Promise<Service[]>;
  create(data: Omit<Service, "id">): Promise<Service>;
  update(id: string, data: Partial<Service>): Promise<void>;
  updateAvailability(id: string, available: boolean): Promise<void>;
}