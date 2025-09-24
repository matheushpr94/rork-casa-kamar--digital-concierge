import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  BOOKING: 'kk.booking',
  ORDERS: 'kk.orders',
  SERVICES: 'kk.services',
  MANUAL_SEEDED: 'kk.manual.seeded',
  MANUAL_CACHE: 'kk.manual.cache',
  ADMIN_TOKEN: 'kk.admin.token',
  MEALS_BY_DATE: 'kk.meals.byDate',
} as const;

const getStorageItem = async (key: string): Promise<string | null> => {
  if (!key?.trim()) return null;
  
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(key);
  }
  return AsyncStorage.getItem(key);
};

const setStorageItem = async (key: string, value: string): Promise<void> => {
  if (!key?.trim() || !value) return;
  
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
    return;
  }
  await AsyncStorage.setItem(key, value);
};

const removeStorageItem = async (key: string): Promise<void> => {
  if (!key?.trim()) return;
  
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
    return;
  }
  await AsyncStorage.removeItem(key);
};

export class LocalStorage {
  static async getBooking() {
    try {
      const data = await getStorageItem(STORAGE_KEYS.BOOKING);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting booking:', error);
      return null;
    }
  }

  static async setBooking(booking: any) {
    try {
      if (booking) {
        await setStorageItem(STORAGE_KEYS.BOOKING, JSON.stringify(booking));
      } else {
        await removeStorageItem(STORAGE_KEYS.BOOKING);
      }
    } catch (error) {
      console.error('Error setting booking:', error);
    }
  }

  static async getOrders(bookingCode: string) {
    try {
      if (!bookingCode?.trim()) return [];
      const code = bookingCode.toUpperCase().trim();
      const data = await getStorageItem(`${STORAGE_KEYS.ORDERS}.${code}`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  static async setOrders(bookingCode: string, orders: any[]) {
    try {
      if (!bookingCode?.trim()) return;
      const code = bookingCode.toUpperCase().trim();
      await setStorageItem(`${STORAGE_KEYS.ORDERS}.${code}`, JSON.stringify(orders));
    } catch (error) {
      console.error('Error setting orders:', error);
    }
  }

  static async addOrder(bookingCode: string, order: any) {
    try {
      const code = bookingCode.toUpperCase().trim();
      const orders = await this.getOrders(code);
      orders.push(order);
      await this.setOrders(code, orders);
      return order;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }

  static async getServices() {
    try {
      const data = await getStorageItem(STORAGE_KEYS.SERVICES);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting services:', error);
      return null;
    }
  }

  static async setServices(services: any[]) {
    try {
      await setStorageItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (error) {
      console.error('Error setting services:', error);
    }
  }

  static async isManualSeeded() {
    try {
      const data = await getStorageItem(STORAGE_KEYS.MANUAL_SEEDED);
      return data === 'true';
    } catch (error) {
      console.error('Error checking manual seed:', error);
      return false;
    }
  }

  static async setManualSeeded() {
    try {
      await setStorageItem(STORAGE_KEYS.MANUAL_SEEDED, 'true');
    } catch (error) {
      console.error('Error setting manual seeded:', error);
    }
  }

  static async getAdminToken() {
    try {
      const data = await getStorageItem(STORAGE_KEYS.ADMIN_TOKEN);
      return data;
    } catch (error) {
      console.error('Error getting admin token:', error);
      return null;
    }
  }

  static async setAdminToken(token: string) {
    try {
      if (token?.trim()) {
        await setStorageItem(STORAGE_KEYS.ADMIN_TOKEN, token);
      } else {
        await removeStorageItem(STORAGE_KEYS.ADMIN_TOKEN);
      }
    } catch (error) {
      console.error('Error setting admin token:', error);
    }
  }

  static async getMealSelections(bookingCode: string, date: string) {
    try {
      if (!bookingCode?.trim() || !date?.trim()) return null;
      const code = bookingCode.toUpperCase().trim();
      const data = await getStorageItem(`${STORAGE_KEYS.MEALS_BY_DATE}.${code}.${date}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting meal selections:', error);
      return null;
    }
  }

  static async setMealSelections(bookingCode: string, date: string, selections: any) {
    try {
      if (!bookingCode?.trim() || !date?.trim()) return;
      const code = bookingCode.toUpperCase().trim();
      await setStorageItem(`${STORAGE_KEYS.MEALS_BY_DATE}.${code}.${date}`, JSON.stringify(selections));
    } catch (error) {
      console.error('Error setting meal selections:', error);
    }
  }

  static async getAllMealSelections(bookingCode: string) {
    try {
      if (!bookingCode?.trim()) return {};
      const code = bookingCode.toUpperCase().trim();
      const keys = await this.getAllMealSelectionKeys(code);
      const selections: { [date: string]: any } = {};
      
      for (const key of keys) {
        const date = key.split('.').pop();
        if (date) {
          const data = await getStorageItem(key);
          if (data) {
            selections[date] = JSON.parse(data);
          }
        }
      }
      
      return selections;
    } catch (error) {
      console.error('Error getting all meal selections:', error);
      return {};
    }
  }

  static async clearMealSelections(bookingCode: string, date?: string) {
    try {
      if (!bookingCode?.trim()) return;
      const code = bookingCode.toUpperCase().trim();
      if (date) {
        await removeStorageItem(`${STORAGE_KEYS.MEALS_BY_DATE}.${code}.${date}`);
      } else {
        const keys = await this.getAllMealSelectionKeys(code);
        await Promise.all(keys.map(key => removeStorageItem(key)));
      }
    } catch (error) {
      console.error('Error clearing meal selections:', error);
    }
  }

  private static async getAllMealSelectionKeys(bookingCode: string): Promise<string[]> {
    const code = bookingCode.toUpperCase().trim();
    const prefix = `${STORAGE_KEYS.MEALS_BY_DATE}.${code}.`;
    const keys: string[] = [];
    
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
    } else {
      const allKeys = await AsyncStorage.getAllKeys();
      keys.push(...allKeys.filter(key => key.startsWith(prefix)));
    }
    
    return keys;
  }

  static async clearGuestData() {
    try {
      const booking = await this.getBooking();
      const bookingCode = booking?.bookingCode?.toUpperCase().trim();
      
      await Promise.all([
        removeStorageItem(STORAGE_KEYS.BOOKING),
        bookingCode ? removeStorageItem(`${STORAGE_KEYS.ORDERS}.${bookingCode}`) : Promise.resolve(),
        bookingCode ? this.clearMealSelections(bookingCode) : Promise.resolve(),
        removeStorageItem(STORAGE_KEYS.SERVICES),
        removeStorageItem(STORAGE_KEYS.MANUAL_CACHE),
      ]);
    } catch (error) {
      console.error('Error clearing guest data:', error);
    }
  }

  static async clearAll() {
    try {
      await Promise.all([
        removeStorageItem(STORAGE_KEYS.BOOKING),
        removeStorageItem(STORAGE_KEYS.ADMIN_TOKEN),
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  static async clearAdminData() {
    try {
      await removeStorageItem(STORAGE_KEYS.ADMIN_TOKEN);
    } catch (error) {
      console.error('Error clearing admin data:', error);
    }
  }

  static async getAdminMenu() {
    try {
      const data = await getStorageItem('kk.menu.admin');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting admin menu:', error);
      return [];
    }
  }

  static async setAdminMenu(menu: any[]) {
    try {
      await setStorageItem('kk.menu.admin', JSON.stringify(menu));
    } catch (error) {
      console.error('Error setting admin menu:', error);
    }
  }
}