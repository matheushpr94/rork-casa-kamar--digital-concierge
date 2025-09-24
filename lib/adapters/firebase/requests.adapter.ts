import { IRequestsRepo, ServiceRequest, RequestStatus } from "@/lib/ports/requests.port";

// TODO: Implement Firestore requests repository
export const requestsRepoFirebase: IRequestsRepo = {
  async create(serviceId: string, payload: { userId: string; note?: string }): Promise<ServiceRequest> {
    // TODO: return await db.collection('requests').add({ serviceId, ...payload, status: 'pending', createdAt: serverTimestamp() })
    throw new Error("Firebase requests adapter not implemented yet");
  },
  async listByUser(userId: string): Promise<ServiceRequest[]> {
    // TODO: return await db.collection('requests').where('userId', '==', userId).orderBy('createdAt', 'desc').get()
    throw new Error("Firebase requests adapter not implemented yet");
  },
  async adminList(params?: { status?: RequestStatus; from?: number; to?: number }): Promise<ServiceRequest[]> {
    // TODO: let query = db.collection('requests').orderBy('createdAt', 'desc')
    // TODO: Apply filters based on params
    // TODO: return await query.get()
    throw new Error("Firebase requests adapter not implemented yet");
  },
  async updateStatus(id: string, status: RequestStatus): Promise<void> {
    // TODO: await db.collection('requests').doc(id).update({ status, updatedAt: serverTimestamp() })
    throw new Error("Firebase requests adapter not implemented yet");
  },
};