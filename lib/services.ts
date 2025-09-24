import type { Service, Order } from '@/types/api';
import type { ServiceRequest } from '@/types/services';

// Services API - ready for Firebase integration
export const servicesService = {
  async list(): Promise<Service[]> {
    // TODO: Replace with Firebase Firestore query
    // return await db.collection('services').where('isAvailable', '==', true).get()
    const { getServices } = await import('@/lib/api');
    return getServices();
  },

  async request(request: ServiceRequest): Promise<Order> {
    // TODO: Replace with Firebase Firestore write + Cloud Functions
    // return await db.collection('orders').add(request)
    const { createOrder } = await import('@/lib/api');
    return createOrder({
      bookingCode: request.bookingCode,
      serviceId: request.serviceId,
      date: request.date,
      time: request.time,
      quantity: request.quantity,
      notes: request.notes || '',
    });
  },
};

// Requests API - ready for Firebase integration
export const requestsService = {
  async listByUser(bookingCode: string): Promise<Order[]> {
    // TODO: Replace with Firebase Firestore query
    // return await db.collection('orders').where('bookingCode', '==', bookingCode).get()
    const { getOrders } = await import('@/lib/api');
    return getOrders(bookingCode);
  },

  async adminList(): Promise<Order[]> {
    // TODO: Replace with Firebase Firestore query for all orders
    // return await db.collection('orders').orderBy('createdAt', 'desc').get()
    throw new Error('Admin list not implemented yet');
  },

  async updateStatus(orderId: string, bookingCode: string, status: string): Promise<Order> {
    // TODO: Replace with Firebase Firestore update
    // return await db.collection('orders').doc(orderId).update({ status })
    const { updateOrderStatus } = await import('@/lib/api');
    return updateOrderStatus(orderId, bookingCode, status);
  },
};

// Menu API - ready for Firebase integration
export const menuService = {
  async listCategories(): Promise<any[]> {
    // TODO: Replace with Firebase Firestore query
    // return await db.collection('menuCategories').orderBy('order').get()
    return [];
  },

  async listItems(categoryId?: string): Promise<any[]> {
    // TODO: Replace with Firebase Firestore query
    // let query = db.collection('menuItems').where('isAvailable', '==', true)
    // if (categoryId) query = query.where('categoryId', '==', categoryId)
    // return await query.get()
    return [];
  },
};