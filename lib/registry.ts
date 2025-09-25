const EXPO_VAR = process.env.EXPO_PUBLIC_USE_FIREBASE;
const NEXT_VAR = process.env.NEXT_PUBLIC_USE_FIREBASE;

// Check if Firebase SDK is available (not in Expo Go)
let hasFirebaseSDK = false;
try {
  require('firebase/app');
  hasFirebaseSDK = true;
} catch {
  hasFirebaseSDK = false;
}

// Only enable Firebase if explicitly set to true AND Firebase SDK is available
const USE_FIREBASE = (EXPO_VAR === "true" || NEXT_VAR === "true") && hasFirebaseSDK;

if (__DEV__) {
  console.log('[Registry] Environment variables detected:');
  console.log('  - EXPO_PUBLIC_USE_FIREBASE:', EXPO_VAR);
  console.log('  - NEXT_PUBLIC_USE_FIREBASE:', NEXT_VAR);
  console.log('  - Firebase SDK available:', hasFirebaseSDK);
  console.log('  - Final USE_FIREBASE:', USE_FIREBASE);
  
  if (USE_FIREBASE) {
    console.log('[Registry] 🔥 Firebase mode enabled');
  } else {
    console.log('[Registry] 🧪 Mock mode enabled' + (hasFirebaseSDK ? '' : ' (Firebase SDK not available)'));
  }
}

export { USE_FIREBASE };