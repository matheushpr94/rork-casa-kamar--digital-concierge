import { IServicesRepo, Service } from "@/lib/ports/services.port";
import { isFirebaseConfigured } from "@/lib/firebase";

export const servicesRepoFirebase: IServicesRepo = {
  async list(): Promise<Service[]> {
    if (!isFirebaseConfigured) {
      if (__DEV__) {
        console.log('[Firebase Services] Firebase config missing — returning empty');
      }
      return [];
    }
    
    if (__DEV__) {
      console.log('[Firebase Services] Fetching services from Firestore');
    }
    
    // TODO: Implement Firestore query
    // const snapshot = await db.collection('services').where('active', '==', true).orderBy('name').get();
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return [];
  },
  
  async create(data: Omit<Service, "id">): Promise<Service> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: Implement Firestore create
    // const docRef = await db.collection('services').add(data);
    // return { id: docRef.id, ...data };
    throw new Error('Firebase services create not implemented');
  },
  
  async update(id: string, data: Partial<Service>): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: Implement Firestore update
    // await db.collection('services').doc(id).update(data);
    throw new Error('Firebase services update not implemented');
  },
  
  async updateAvailability(id: string, available: boolean): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: Implement Firestore update
    // await db.collection('services').doc(id).update({ active: available });
    throw new Error('Firebase services updateAvailability not implemented');
  },
};

if (__DEV__) {
  console.log('[Firebase Services] Adapter initialized');
}