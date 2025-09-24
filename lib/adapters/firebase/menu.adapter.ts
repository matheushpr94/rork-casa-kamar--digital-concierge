import { IMenuRepo, MenuCategory, MenuItem } from "@/lib/ports/menu.port";

// TODO: Implement Firestore menu repository
export const menuRepoFirebase: IMenuRepo = {
  async listCategories(): Promise<MenuCategory[]> {
    // TODO: return await db.collection('menuCategories').orderBy('order').get()
    throw new Error("Firebase menu adapter not implemented yet");
  },
  async listItems(): Promise<MenuItem[]> {
    // TODO: let query = db.collection('menuItems').where('available', '==', true)
    // TODO: return await query.get()
    throw new Error("Firebase menu adapter not implemented yet");
  },
  async createItem(data: Omit<MenuItem, "id">): Promise<MenuItem> {
    // TODO: return await db.collection('menuItems').add(data)
    throw new Error("Firebase menu adapter not implemented yet");
  },
  async updateAvailability(id: string, available: boolean): Promise<void> {
    // TODO: await db.collection('menuItems').doc(id).update({ available })
    throw new Error("Firebase menu adapter not implemented yet");
  },
};