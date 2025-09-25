// Firebase configuration - currently disabled to avoid bundling issues
// TODO: Implement Firebase when needed

if (__DEV__) {
  console.log('[Firebase] Firebase disabled - using mock data');
}

// Stub exports
export const app = null;
export const auth = null;
export const db = null;
export const storage = null;
export const isFirebaseConfigured = false;