export interface BookingData {
  bookingCode: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  propertyName: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  unit?: string;
  category: string;
  leadTime?: string;
  isAvailable: boolean;
}

export interface CreateOrderRequest {
  bookingCode: string;
  serviceId: string;
  date: string;
  time: string;
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  bookingCode: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  quantity: number;
  notes: string;
  status: 'RECEIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
}

export interface MealItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'breakfast' | 'snacks' | 'lunch' | 'dinner';
}

export interface DayMealSelections {
  breakfast: string[];
  snacks: string[];
  lunch: string[];
  dinner: string[];
}

export interface MealSelections {
  [date: string]: DayMealSelections;
}