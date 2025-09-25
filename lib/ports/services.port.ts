export type ServiceVariant = {
  id: string;
  label?: string;
  name?: string;  // For backward compatibility
  price: number;
};

export type Service = { 
  id: string; 
  name: string; 
  description?: string; 
  category?: string;
  price?: number; 
  unit?: string;
  duration?: string | number;
  durationMin?: number; // Legacy field name
  available?: boolean;
  active?: boolean;
  order?: number;
  featured?: boolean;
  variants?: ServiceVariant[];
};

export interface IServicesRepo {
  list(): Promise<Service[]>;
  create(data: Omit<Service, "id">): Promise<Service>;
  update(id: string, data: Partial<Service>): Promise<void>;
  updateAvailability(id: string, available: boolean): Promise<void>;
}