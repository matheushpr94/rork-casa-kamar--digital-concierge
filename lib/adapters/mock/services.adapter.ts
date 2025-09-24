import { IServicesRepo, Service } from "@/lib/ports/services.port";

const services: Service[] = [
  { 
    id: "svc-limpeza-extra", 
    name: "Limpeza Extra", 
    description: "Limpeza adicional completa do ambiente", 
    price: 80, 
    durationMin: 180, 
    available: true 
  },
  { 
    id: "svc-limpeza-completa", 
    name: "Limpeza Completa", 
    description: "Limpeza profunda com organização", 
    price: 120, 
    durationMin: 300, 
    available: true 
  },
  { 
    id: "svc-almoco-caseiro", 
    name: "Almoço Caseiro", 
    description: "Refeição completa preparada por chef", 
    price: 45, 
    durationMin: 150, 
    available: true 
  },
  { 
    id: "svc-churrasco-premium", 
    name: "Churrasco Premium", 
    description: "Churrasco completo com acompanhamentos", 
    price: 85, 
    durationMin: 300, 
    available: true 
  },
  { 
    id: "svc-transfer-aeroporto", 
    name: "Transfer Aeroporto", 
    description: "Transporte confortável de/para aeroporto", 
    price: 120, 
    durationMin: 90, 
    available: true 
  },
  { 
    id: "svc-passeio-lancha", 
    name: "Passeio de Lancha", 
    description: "Passeio exclusivo de lancha", 
    price: 300, 
    durationMin: 1440, 
    available: true 
  },
];

export const servicesRepoMock: IServicesRepo = {
  async list() { 
    return services.filter(s => s.available); 
  },
  async create(data) { 
    const service = { id: String(Date.now()), ...data }; 
    services.unshift(service); 
    return service; 
  },
  async updateAvailability(id, available) { 
    const service = services.find(x => x.id === id); 
    if (service) service.available = available; 
  },
};