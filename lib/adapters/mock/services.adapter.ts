import { IServicesRepo, Service } from "@/lib/ports/services.port";

const services: Service[] = [
  { 
    id: "svc-limpeza-extra", 
    name: "Limpeza Extra", 
    description: "Limpeza adicional completa do ambiente", 
    price: 80, 
    durationMin: 180, 
    available: true,
    active: true,
    order: 1
  },
  { 
    id: "svc-limpeza-completa", 
    name: "Limpeza Completa", 
    description: "Limpeza profunda com organização", 
    price: 120, 
    durationMin: 300, 
    available: true,
    active: true,
    order: 2
  },
  { 
    id: "svc-almoco-caseiro", 
    name: "Almoço Caseiro", 
    description: "Refeição completa preparada por chef", 
    price: 45, 
    durationMin: 150, 
    available: true,
    active: true,
    order: 3
  },
  { 
    id: "svc-churrasco-premium", 
    name: "Churrasco Premium", 
    description: "Churrasco completo com acompanhamentos", 
    price: 85, 
    durationMin: 300, 
    available: true,
    active: true,
    order: 4
  },
  { 
    id: "svc-transfer-aeroporto", 
    name: "Transfer Aeroporto", 
    description: "Transporte confortável de/para aeroporto", 
    price: 120, 
    durationMin: 90, 
    available: true,
    active: true,
    order: 5,
    variants: [
      { id: "car", name: "Carro", price: 120 },
      { id: "van", name: "Van", price: 180 }
    ]
  },
  { 
    id: "svc-passeio-lancha", 
    name: "Passeio de Lancha", 
    description: "Passeio exclusivo de lancha", 
    price: 300, 
    durationMin: 1440, 
    available: true,
    active: true,
    order: 6
  },
];

export const servicesRepoMock: IServicesRepo = {
  async list() { 
    const activeServices = services.filter(s => s.active === true);
    return activeServices.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });
  },
  async create(data) { 
    const service = { id: String(Date.now()), ...data }; 
    services.unshift(service); 
    return service; 
  },
  async update(id, data) {
    const index = services.findIndex(x => x.id === id);
    if (index !== -1) {
      services[index] = { ...services[index], ...data };
    }
  },
  async updateAvailability(id, available) { 
    const service = services.find(x => x.id === id); 
    if (service) service.available = available; 
  },
};

// For admin, we need a method to get all services (including inactive)
export const servicesRepoMockAdmin = {
  ...servicesRepoMock,
  async list() {
    return services.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });
  },
};