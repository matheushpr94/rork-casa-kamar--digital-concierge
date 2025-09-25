import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import type { ManualPort, ManualItem, ManualListParams } from '@/lib/ports/manual.port';

class FirebaseManualAdapter implements ManualPort {
  private collectionName = 'manual_items';

  async list(params: ManualListParams = {}): Promise<ManualItem[]> {
    if (!isFirebaseConfigured || !db) {
      if (__DEV__) {
        console.log('[Firebase Manual] Firebase not configured - returning empty list');
      }
      return [];
    }

    try {
      const { search, onlyActive = true, limit = 20 } = params;
      
      let q = query(collection(db, this.collectionName));
      
      if (onlyActive) {
        q = query(q, where('active', '==', true));
      }
      
      q = query(q, orderBy('createdAt', 'desc'));
      
      // Cap the limit for search to avoid fetching too much data
      const fetchLimit = search ? Math.min(limit, 100) : limit;
      q = query(q, firestoreLimit(fetchLimit));
      
      const snapshot = await getDocs(q);
      let items: ManualItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as ManualItem[];
      
      // Apply client-side search filter if needed
      if (search) {
        const searchLower = search.toLowerCase();
        items = items.filter(item => 
          item.title.toLowerCase().includes(searchLower) ||
          item.content.toLowerCase().includes(searchLower) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      
      if (__DEV__) {
        console.log(`[Firebase Manual] list() fetched ${items.length} docs`);
      }
      
      return items;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Manual] Error fetching manual items:', error);
      }
      return [];
    }
  }

  async getById(id: string): Promise<ManualItem | null> {
    if (!isFirebaseConfigured || !db) {
      return null;
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as ManualItem;
      }
      
      return null;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Manual] Error fetching manual item:', error);
      }
      return null;
    }
  }

  async create(input: Omit<ManualItem,'id'|'createdAt'|'updatedAt'>): Promise<string> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase not configured');
    }

    try {
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      if (__DEV__) {
        console.log('[Firebase Manual] Created manual item:', docRef.id);
      }
      
      return docRef.id;
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Manual] Error creating manual item:', error);
      }
      throw error;
    }
  }

  async update(id: string, patch: Partial<Omit<ManualItem,'id'|'createdAt'|'updatedAt'>>): Promise<void> {
    if (!isFirebaseConfigured || !db) {
      throw new Error('Firebase not configured');
    }

    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...patch,
        updatedAt: serverTimestamp(),
      });
      
      if (__DEV__) {
        console.log('[Firebase Manual] Updated manual item:', id);
      }
    } catch (error) {
      if (__DEV__) {
        console.error('[Firebase Manual] Error updating manual item:', error);
      }
      throw error;
    }
  }
}

export const manualRepoFirebase = new FirebaseManualAdapter();