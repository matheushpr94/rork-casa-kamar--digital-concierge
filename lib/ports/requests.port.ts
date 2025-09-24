export type RequestStatus = "pending" | "received" | "in_progress" | "done" | "canceled";

export type ServiceRequest = {
  id: string; 
  serviceId: string; 
  userId: string;
  note?: string; 
  status: RequestStatus; 
  createdAt: number; 
  updatedAt?: number;
};

export interface IRequestsRepo {
  create(serviceId: string, payload: { userId: string; note?: string }): Promise<ServiceRequest>;
  listByUser(userId: string): Promise<ServiceRequest[]>;
  adminList(params?: { status?: RequestStatus; from?: number; to?: number }): Promise<ServiceRequest[]>;
  updateStatus(id: string, status: RequestStatus): Promise<void>;
}