import { IMenuRepo, MenuCategory, MenuItem } from "@/lib/ports/menu.port";

const categories: MenuCategory[] = [
  { id: "breakfast", name: "Café da Manhã", order: 1 },
  { id: "snacks", name: "Petiscos", order: 2 },
  { id: "lunch", name: "Almoço", order: 3 },
  { id: "dinner", name: "Jantar", order: 4 },
];

const items: MenuItem[] = [];

export const menuRepoMock: IMenuRepo = {
  async listCategories() { 
    return categories; 
  },
  async listItems() { 
    return items; 
  },
  async createItem(data) { 
    const item = { id: String(Date.now()), ...data }; 
    items.unshift(item); 
    return item; 
  },
  async updateAvailability(id, available) { 
    const item = items.find(x => x.id === id); 
    if (item) item.available = available; 
  },
};