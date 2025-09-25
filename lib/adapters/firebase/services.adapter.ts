import { collection, query, where, orderBy, getDocs, doc, addDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import { IServicesRepo, Service, ServiceVariant } from "@/lib/ports/services.port";

// Helper function to normalize variants from different formats
function normalizeVariants(variants: any): ServiceVariant[] {
  if (!variants) return [];
  
  // If it's already an array, return as is
  if (Array.isArray(variants)) {
    return variants.map(v => ({
      id: v.id || v.name?.toLowerCase().replace(/\s+/g, '-') || 'variant',
      name: v.name || v.label || 'Variante',
      price: v.price || 0
    }));
  }
  
  // If it's an object like {carro: {label, price}, van: {label, price}}
  if (typeof variants === 'object') {
    return Object.entries(variants).map(([key, value]: [string, any]) => ({
      id: key,
      name: value.label || value.name || key,
      price: value.price || 0
    }));
  }
  
  return [];
}

export const servicesRepoFirebase: IServicesRepo = {
  async list(): Promise<Service[]> {
    if (!isFirebaseConfigured || !db) {
      console.error('[Firebase Services] Firebase not configured properly');
      throw new Error('Firebase not configured');
    }
    
    try {
      if (__DEV__) {
        console.log('[Firebase Services] Fetching services from Firestore...');
      }
      
      const servicesRef = collection(db, 'services');
      const q = query(
        servicesRef,
        where('active', '==', true),
        orderBy('name', 'asc') // Using only name ordering to avoid index issues
      );
      
      const snapshot = await getDocs(q);
      const services = snapshot.docs.map(doc => {
        const data = doc.data();
        const service: Service = {
          id: doc.id,
          name: data.name || '',
          description: data.description,
          category: data.category,
          price: data.price,
          unit: data.unit,
          duration: data.duration,
          durationMin: data.duration || data.durationMin, // Prefer duration, fallback to durationMin
          available: data.available !== false, // Default to true if not specified
          active: data.active !== false,
          order: data.order,
          variants: normalizeVariants(data.variants)
        };
        return service;
      });
      
      // Sort by order first, then by name
      const sortedServices = services.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return a.name.localeCompare(b.name);
      });
      
      if (__DEV__) {
        console.log(`[Firebase Services] Loaded ${sortedServices.length} services`);
      }
      
      return sortedServices;
    } catch (error) {
      console.error('[Firebase Services] Error fetching services:', error);
      throw error;
    }
  },
  
  async create(data: Omit<Service, "id">): Promise<Service> {
    if (!isFirebaseConfigured || !db) {
      console.error('[Firebase Services] Firebase not configured properly');
      throw new Error('Firebase not configured');
    }
    
    try {
      const servicesRef = collection(db, 'services');
      const docRef = await addDoc(servicesRef, {
        ...data,
        active: data.active !== false,
        available: data.available !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return {
        id: docRef.id,
        ...data
      };
    } catch (error) {
      console.error('[Firebase Services] Error creating service:', error);
      throw error;
    }
  },
  
  async update(id: string, data: Partial<Service>): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      console.error('[Firebase Services] Firebase not configured properly');
      throw new Error('Firebase not configured');
    }
    
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, {
        ...data,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('[Firebase Services] Error updating service:', error);
      throw error;
    }
  },
  
  async updateAvailability(id: string, available: boolean): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      console.error('[Firebase Services] Firebase not configured properly');
      throw new Error('Firebase not configured');
    }
    
    try {
      const serviceRef = doc(db, 'services', id);
      await updateDoc(serviceRef, {
        available,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('[Firebase Services] Error updating availability:', error);
      throw error;
    }
  },
};

if (__DEV__) {
  console.log('[Firebase Services] Services adapter initialized');
}