import { IServicesRepo, Service } from "@/lib/ports/services.port";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";

export const servicesRepoFirebase: IServicesRepo = {
  async list(): Promise<Service[]> {
    if (!isFirebaseConfigured || !db) {
      if (__DEV__) {
        console.log('[Firebase Services] Firebase config missing — returning empty');
      }
      return [];
    }
    
    try {
      if (__DEV__) {
        console.log('[Firebase Services] Fetching services from Firestore');
      }
      
      const servicesRef = collection(db, 'services');
      const q = query(
        servicesRef,
        where('active', '==', true),
        orderBy('name', 'asc')
      );
      
      const snapshot = await getDocs(q);
      const services = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Normalize variants - accept both objects {carro:{label,price}} and arrays [{id,name/label,price}]
        let normalizedVariants = undefined;
        if (data.variants) {
          if (Array.isArray(data.variants)) {
            // Already an array, just ensure consistent structure
            normalizedVariants = data.variants.map((variant: any) => ({
              id: variant.id || variant.name || variant.label,
              label: variant.label || variant.name,
              price: variant.price || 0
            }));
          } else if (typeof data.variants === 'object') {
            // Convert object to array
            normalizedVariants = Object.entries(data.variants).map(([key, value]: [string, any]) => ({
              id: key,
              label: value.label || key,
              price: value.price || 0
            }));
          }
        }
        
        return {
          id: doc.id,
          name: data.name || '',
          description: data.description,
          category: data.category,
          price: data.price || 0,
          unit: data.unit,
          duration: data.duration,
          active: data.active || false,
          order: data.order,
          variants: normalizedVariants
        } as Service;
      });
      
      if (__DEV__) {
        console.log(`[Firebase Services] list() fetched ${services.length}`);
      }
      
      return services;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Services] Error fetching services:', error);
      }
      return [];
    }
  },
  
  async create(data: Omit<Service, "id">): Promise<Service> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase not configured');
    }
    
    try {
      const servicesRef = collection(db, 'services');
      const docRef = await addDoc(servicesRef, data);
      return { id: docRef.id, ...data } as Service;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Services] Error creating service:', error);
      }
      throw error;
    }
  },
  
  async update(id: string, data: Partial<Service>): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase not configured');
    }
    
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, data);
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Services] Error updating service:', error);
      }
      throw error;
    }
  },
  
  async updateAvailability(id: string, available: boolean): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase not configured');
    }
    
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, { active: available });
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Services] Error updating service availability:', error);
      }
      throw error;
    }
  },
};

if (__DEV__) {
  console.log('[Firebase Services] Adapter initialized');
}