import type { BookingData, Service, Order, CreateOrderRequest } from '@/types/api';
import { LocalStorage } from './storage';

const SEED_SERVICES: Service[] = [
  {
    id: 'cleaning',
    name: 'Limpeza Adicional',
    description: 'Serviço de limpeza completa do ambiente',
    price: 80.00,
    unit: 'por limpeza',
    leadTime: '2-4 horas',
    isAvailable: true,
    category: 'Limpeza',
  },
  {
    id: 'kitchen-service',
    name: 'Serviço de Cozinha',
    description: 'Chef particular para preparar refeições',
    price: 150.00,
    unit: 'por refeição',
    leadTime: '4-6 horas',
    isAvailable: true,
    category: 'Cozinha',
  },
  {
    id: 'grocery-shopping',
    name: 'Compras de Supermercado',
    description: 'Fazemos suas compras e entregamos na casa',
    price: 45.00,
    unit: 'por compra',
    leadTime: '2-3 horas',
    isAvailable: true,
    category: 'Cozinha',
  },
  {
    id: 'airport-transfer',
    name: 'Transfer Aeroporto',
    description: 'Transporte confortável de/para o aeroporto',
    price: 120.00,
    unit: 'por trajeto',
    leadTime: '1-2 horas',
    isAvailable: true,
    category: 'Transporte',
  },
  {
    id: 'city-tour',
    name: 'City Tour',
    description: 'Passeio guiado pelos pontos turísticos da cidade',
    price: 200.00,
    unit: 'por pessoa',
    leadTime: '24 horas',
    isAvailable: true,
    category: 'Transporte',
  },
  {
    id: 'laundry-service',
    name: 'Serviço de Lavanderia',
    description: 'Lavagem, secagem e passagem de roupas',
    price: 35.00,
    unit: 'por carga',
    leadTime: '24 horas',
    isAvailable: true,
    category: 'Limpeza',
  },
  {
    id: 'massage-service',
    name: 'Massagem Relaxante',
    description: 'Massagem terapêutica no conforto da casa',
    price: 180.00,
    unit: 'por sessão',
    leadTime: '4-8 horas',
    isAvailable: false,
    category: 'Bem-estar',
  },
  {
    id: 'bike-rental',
    name: 'Aluguel de Bicicletas',
    description: 'Bicicletas para explorar a cidade',
    price: 25.00,
    unit: 'por dia',
    leadTime: '1 hora',
    isAvailable: true,
    category: 'Transporte',
  },
];

const MOCK_BOOKING: BookingData = {
  bookingCode: 'AZ123456',
  guestName: 'Silva',
  checkIn: '2025-10-01',
  checkOut: '2025-10-05',
  guests: 4,
  propertyName: 'Casa Kamará - Suíte Premium',
};

export async function verifyBooking(bookingCode: string, guestLastName: string): Promise<BookingData> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (bookingCode?.trim() === 'AZ123456' && guestLastName?.trim().toLowerCase() === 'silva') {
    return MOCK_BOOKING;
  }
  
  throw new Error('Código de reserva ou sobrenome incorretos');
}

export async function getServices(): Promise<Service[]> {
  let services = await LocalStorage.getServices();
  
  if (!services) {
    services = SEED_SERVICES;
    await LocalStorage.setServices(services);
  }
  
  return services.filter((service: Service) => service.isAvailable);
}

export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  if (!orderData?.bookingCode?.trim() || !orderData?.serviceId?.trim()) {
    throw new Error('Dados inválidos');
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newOrder: Order = {
    id: `ord_${Date.now()}`,
    bookingCode: orderData.bookingCode.trim(),
    serviceId: orderData.serviceId.trim(),
    serviceName: 'Serviço Solicitado',
    date: orderData.date,
    time: orderData.time,
    quantity: orderData.quantity || 1,
    notes: orderData.notes?.trim() || '',
    status: 'RECEIVED',
    createdAt: new Date().toISOString(),
    totalPrice: 0,
  };
  
  return LocalStorage.addOrder(orderData.bookingCode, newOrder);
}

export async function getOrders(bookingCode: string): Promise<Order[]> {
  if (!bookingCode?.trim()) {
    throw new Error('Código de reserva inválido');
  }
  
  return LocalStorage.getOrders(bookingCode);
}

export async function updateOrderStatus(orderId: string, bookingCode: string, newStatus: string): Promise<Order> {
  const orders = await LocalStorage.getOrders(bookingCode);
  const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
  
  if (orderIndex === -1) {
    throw new Error('Pedido não encontrado');
  }
  
  orders[orderIndex].status = newStatus;
  await LocalStorage.setOrders(bookingCode, orders);
  
  return orders[orderIndex];
}