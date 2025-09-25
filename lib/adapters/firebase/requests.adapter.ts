import { IRequestsRepo, ServiceRequest, RequestStatus } from "@/lib/ports/requests.port";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { servicesRepoFirebase } from "./services.adapter";

export const requestsRepoFirebase: IRequestsRepo = {
  async create(serviceId: string, payload: { userId: string; note?: string; variantId?: string; price?: number }): Promise<ServiceRequest> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase not configured');
    }
    
    try {
      // Get service details to denormalize data
      const services = await servicesRepoFirebase.list();
      const service = services.find(s => s.id === serviceId);
      const serviceName = service?.name || '';
      
      // Find variant name if variantId is provided
      let variantName = '';
      if (payload.variantId && service?.variants) {
        const variant = service.variants.find(v => v.id === payload.variantId);
        variantName = variant?.label ?? variant?.name ?? '';
      }
      
      const requestData = {
        serviceId,
        serviceName,
        userId: payload.userId,
        note: payload.note,
        variantId: payload.variantId,
        variantName,
        price: payload.price,
        status: 'pending' as RequestStatus,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const requestsRef = collection(db, 'requests');
      const docRef = await addDoc(requestsRef, requestData);
      
      if (__DEV__) {
        console.log(`[Firebase Requests] Created request ${docRef.id} for service ${serviceId}`);
      }
      
      return {
        id: docRef.id,
        serviceId,
        userId: payload.userId,
        note: payload.note,
        variantId: payload.variantId,
        variantName,
        price: payload.price,
        status: 'pending',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Requests] Error creating request:', error);
      }
      throw error;
    }
  },
  
  async listByUser(userId: string): Promise<ServiceRequest[]> {
    if (!isFirebaseConfigured || !db) {
      if (__DEV__) {
        console.log('[Firebase Requests] Firebase config missing — returning empty');
      }
      return [];
    }
    
    try {
      const requestsRef = collection(db, 'requests');
      // Temporary: Use only where clause, sort client-side to avoid index requirement
      const q = query(
        requestsRef,
        where('userId', '==', userId)
      );
      
      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          serviceId: data.serviceId,
          userId: data.userId,
          note: data.note,
          variantId: data.variantId,
          variantName: data.variantName,
          price: data.price,
          status: data.status,
          createdAt: data.createdAt?.toMillis?.() || Date.now(),
          updatedAt: data.updatedAt?.toMillis?.() || Date.now()
        } as ServiceRequest;
      }).sort((a, b) => b.createdAt - a.createdAt); // Client-side sort by createdAt desc
      
      if (__DEV__) {
        console.log(`[Firebase Requests] listByUser(${userId}) fetched ${requests.length}`);
      }
      
      return requests;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Requests] Error fetching user requests:', error);
      }
      return [];
    }
  },
  
  async adminList(params?: { status?: RequestStatus; from?: number; to?: number }): Promise<ServiceRequest[]> {
    if (!isFirebaseConfigured || !db) {
      if (__DEV__) {
        console.log('[Firebase Requests] Firebase config missing — returning empty');
      }
      return [];
    }
    
    try {
      const requestsRef = collection(db, 'requests');
      let q = query(requestsRef, orderBy('createdAt', 'desc'));
      
      // Apply status filter if provided
      if (params?.status) {
        q = query(requestsRef, where('status', '==', params.status), orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          serviceId: data.serviceId,
          userId: data.userId,
          note: data.note,
          variantId: data.variantId,
          variantName: data.variantName,
          price: data.price,
          status: data.status,
          createdAt: data.createdAt?.toMillis?.() || Date.now(),
          updatedAt: data.updatedAt?.toMillis?.() || Date.now()
        } as ServiceRequest;
      });
      
      if (__DEV__) {
        console.log(`[Firebase Requests] adminList() fetched ${requests.length}`);
      }
      
      return requests;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Requests] Error fetching admin requests:', error);
      }
      return [];
    }
  },
  
  async updateStatus(id: string, status: RequestStatus): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase not configured');
    }
    
    try {
      const requestRef = doc(db, 'requests', id);
      await updateDoc(requestRef, { 
        status, 
        updatedAt: serverTimestamp() 
      });
      
      if (__DEV__) {
        console.log(`[Firebase Requests] Updated request ${id} status to ${status}`);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Requests] Error updating request status:', error);
      }
      throw error;
    }
  },
};

if (__DEV__) {
  console.log('[Firebase Requests] Adapter initialized');
}