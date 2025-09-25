import { IRequestsRepo, ServiceRequest, RequestStatus } from "@/lib/ports/requests.port";

const requests: ServiceRequest[] = [
  {
    id: "req-1",
    serviceId: "svc-limpeza-extra",
    userId: "mock-user",
    note: "Preciso de limpeza extra no quarto principal",
    status: "pending",
    createdAt: Date.now() - 86400000, // 1 day ago
  },
  {
    id: "req-2", 
    serviceId: "svc-almoco-caseiro",
    userId: "mock-user",
    note: "Para 4 pessoas, sem pimenta",
    status: "in_progress",
    createdAt: Date.now() - 43200000, // 12 hours ago
  },
];

export const requestsRepoMock: IRequestsRepo = {
  async create(serviceId, { userId, note, variantId, price }) {
    const request: ServiceRequest = { 
      id: String(Date.now()), 
      serviceId, 
      userId, 
      note, 
      status: "pending", 
      createdAt: Date.now(),
      variantId,
      price
    };
    requests.unshift(request); 
    return request;
  },
  async listByUser(userId) { 
    return requests.filter(r => r.userId === userId); 
  },
  async adminList(params) {
    return requests.filter(r => 
      (params?.status ? r.status === params.status : true) &&
      (params?.from ? r.createdAt >= params.from : true) &&
      (params?.to ? r.createdAt <= params.to : true)
    );
  },
  async updateStatus(id, status) {
    const request = requests.find(x => x.id === id); 
    if (request) { 
      request.status = status; 
      request.updatedAt = Date.now(); 
    }
  },
};