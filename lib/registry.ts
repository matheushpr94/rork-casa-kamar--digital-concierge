const USE_FIREBASE = process.env.EXPO_PUBLIC_USE_FIREBASE === "true" || process.env.NEXT_PUBLIC_USE_FIREBASE === "true";

if (__DEV__) {
  console.log('[Registry] USE_FIREBASE:', USE_FIREBASE);
  console.log('[Registry] EXPO_PUBLIC_USE_FIREBASE:', process.env.EXPO_PUBLIC_USE_FIREBASE);
  console.log('[Registry] NEXT_PUBLIC_USE_FIREBASE:', process.env.NEXT_PUBLIC_USE_FIREBASE);
}

export { USE_FIREBASE };