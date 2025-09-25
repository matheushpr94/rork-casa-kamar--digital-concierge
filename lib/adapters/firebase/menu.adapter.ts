import { IMenuRepo, MenuCategory, MenuItem } from "@/lib/ports/menu.port";
import { isFirebaseConfigured } from "@/lib/firebase";

export const menuRepoFirebase: IMenuRepo = {
  async listCategories(): Promise<MenuCategory[]> {
    if (!isFirebaseConfigured) {
      if (__DEV__) {
        console.log('[Firebase Menu] Firebase config missing — returning empty');
      }
      return [];
    }
    
    // TODO: return await db.collection('menuCategories').orderBy('order').get()
    return [];
  },
  
  async listItems(): Promise<MenuItem[]> {
    if (!isFirebaseConfigured) {
      if (__DEV__) {
        console.log('[Firebase Menu] Firebase config missing — returning empty');
      }
      return [];
    }
    
    // TODO: let query = db.collection('menuItems').where('available', '==', true)
    // TODO: return await query.get()
    return [];
  },
  
  async createItem(data: Omit<MenuItem, "id">): Promise<MenuItem> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: return await db.collection('menuItems').add(data)
    throw new Error("Firebase menu createItem not implemented yet");
  },
  
  async updateAvailability(id: string, available: boolean): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: await db.collection('menuItems').doc(id).update({ available })
    throw new Error("Firebase menu updateAvailability not implemented yet");
  },
};

if (__DEV__) {
  console.log('[Firebase Menu] Adapter initialized');
}