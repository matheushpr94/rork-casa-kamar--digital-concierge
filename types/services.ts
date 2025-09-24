// Service types for better organization
export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ServiceRequest {
  serviceId: string;
  bookingCode: string;
  date: string;
  time: string;
  quantity: number;
  notes?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  allergens?: string[];
  preparationTime?: string;
}