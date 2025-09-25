import { IRequestsRepo, ServiceRequest, RequestStatus } from "@/lib/ports/requests.port";
import { isFirebaseConfigured } from "@/lib/firebase";

export const requestsRepoFirebase: IRequestsRepo = {
  async create(serviceId: string, payload: { userId: string; note?: string }): Promise<ServiceRequest> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: return await db.collection('requests').add({ serviceId, ...payload, status: 'pending', createdAt: serverTimestamp() })
    throw new Error("Firebase requests create not implemented yet");
  },
  
  async listByUser(userId: string): Promise<ServiceRequest[]> {
    if (!isFirebaseConfigured) {
      if (__DEV__) {
        console.log('[Firebase Requests] Firebase config missing — returning empty');
      }
      return [];
    }
    
    // TODO: return await db.collection('requests').where('userId', '==', userId).orderBy('createdAt', 'desc').get()
    return [];
  },
  
  async adminList(params?: { status?: RequestStatus; from?: number; to?: number }): Promise<ServiceRequest[]> {
    if (!isFirebaseConfigured) {
      if (__DEV__) {
        console.log('[Firebase Requests] Firebase config missing — returning empty');
      }
      return [];
    }
    
    // TODO: let query = db.collection('requests').orderBy('createdAt', 'desc')
    // TODO: Apply filters based on params
    // TODO: return await query.get()
    return [];
  },
  
  async updateStatus(id: string, status: RequestStatus): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: await db.collection('requests').doc(id).update({ status, updatedAt: serverTimestamp() })
    throw new Error("Firebase requests updateStatus not implemented yet");
  },
};

if (__DEV__) {
  console.log('[Firebase Requests] Adapter initialized');
}