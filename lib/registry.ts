// Firebase is currently disabled to avoid bundling issues
const USE_FIREBASE = false;

if (__DEV__) {
  console.log('[Registry] 🧪 Mock mode enabled (Firebase disabled)');
}

export { USE_FIREBASE };