// Firebase imports - only available in custom dev client, not Expo Go
let initializeApp: any = null;
let getApps: any = null;
let getApp: any = null;
let getAuth: any = null;
let getFirestore: any = null;
let getStorage: any = null;

try {
  const firebaseApp = require('firebase/app');
  const firebaseAuth = require('firebase/auth');
  const firebaseFirestore = require('firebase/firestore');
  const firebaseStorage = require('firebase/storage');
  
  initializeApp = firebaseApp.initializeApp;
  getApps = firebaseApp.getApps;
  getApp = firebaseApp.getApp;
  getAuth = firebaseAuth.getAuth;
  getFirestore = firebaseFirestore.getFirestore;
  getStorage = firebaseStorage.getStorage;
} catch (error) {
  if (__DEV__) {
    console.log('[Firebase] Firebase SDK not available in Expo Go - using mock data');
  }
}

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is complete and SDK is available
const hasFirebaseSDK = initializeApp !== null;
const isFirebaseConfigured = hasFirebaseSDK && Object.values(firebaseConfig).every(value => value && value !== 'undefined');

if (__DEV__) {
  console.log('[Firebase] SDK available:', hasFirebaseSDK);
  console.log('[Firebase] Configuration status:', isFirebaseConfigured ? 'Complete' : 'Incomplete');
  if (!hasFirebaseSDK) {
    console.log('[Firebase] Firebase SDK not available - running in Expo Go mode');
  } else if (!isFirebaseConfigured) {
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

if (isFirebaseConfigured && hasFirebaseSDK) {
  try {
    // Check if Firebase app is already initialized
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    if (__DEV__) {
      console.log('[Firebase] Successfully initialized');
    }
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
  }
}

export { app, auth, db, storage };
export { isFirebaseConfigured };