const EXPO_VAR = process.env.EXPO_PUBLIC_USE_FIREBASE;
const NEXT_VAR = process.env.NEXT_PUBLIC_USE_FIREBASE;
const USE_FIREBASE = EXPO_VAR === "true" || NEXT_VAR === "true";

if (__DEV__) {
  console.log('[Registry] Environment variables detected:');
  console.log('  - EXPO_PUBLIC_USE_FIREBASE:', EXPO_VAR);
  console.log('  - NEXT_PUBLIC_USE_FIREBASE:', NEXT_VAR);
  console.log('  - Final USE_FIREBASE:', USE_FIREBASE);
  
  if (USE_FIREBASE) {
    console.log('[Registry] 🔥 Firebase mode enabled');
  } else {
    console.log('[Registry] 🧪 Mock mode enabled');
  }
}

export { USE_FIREBASE };