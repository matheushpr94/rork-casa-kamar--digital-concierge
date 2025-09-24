export type MenuCategory = { 
  id: string; 
  name: string; 
  order?: number; 
};

export type MenuItem = {
  id: string; 
  title: string; 
  price: number; 
  categoryId: string;
  description?: string; 
  photoUrl?: string; 
  available?: boolean; 
  order?: number;
};

export interface IMenuRepo {
  listCategories(): Promise<MenuCategory[]>;
  listItems(): Promise<MenuItem[]>;
  createItem(data: Omit<MenuItem, "id">): Promise<MenuItem>;
  updateAvailability(id: string, available: boolean): Promise<void>;
}