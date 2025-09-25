import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is complete
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => value && value !== 'undefined');

if (__DEV__) {
  console.log('[Firebase] Configuration status:', isFirebaseConfigured ? 'Complete' : 'Incomplete');
  if (!isFirebaseConfigured) {
    console.log('[Firebase] Missing environment variables - Firebase will not be initialized');
  } else {
    console.log('[Firebase] Initializing with project:', firebaseConfig.projectId);
  }
}

// Only initialize Firebase if configuration is complete
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
  }
}

export { app, auth, db, storage };
export { isFirebaseConfigured };