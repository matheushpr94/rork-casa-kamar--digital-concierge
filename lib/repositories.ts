import { USE_FIREBASE } from "@/lib/registry";
import { isFirebaseConfigured } from "@/lib/firebase";
import { menuRepoMock } from "@/lib/adapters/mock/menu.adapter";
import { servicesRepoMock } from "@/lib/adapters/mock/services.adapter";
import { requestsRepoMock } from "@/lib/adapters/mock/requests.adapter";
import { authMock } from "@/lib/adapters/mock/auth.adapter";

// Firebase adapters
import { servicesRepoFirebase } from "@/lib/adapters/firebase/services.adapter";
// import { menuRepoFirebase } from "@/lib/adapters/firebase/menu.adapter";
// import { requestsRepoFirebase } from "@/lib/adapters/firebase/requests.adapter";
// import { authFirebase } from "@/lib/adapters/firebase/auth.adapter";

// Determine if we should use Firebase (both flag enabled AND properly configured)
const shouldUseFirebase = USE_FIREBASE && isFirebaseConfigured;

if (__DEV__) {
  console.log('[Repositories] Repository providers:');
  console.log('  - USE_FIREBASE flag:', USE_FIREBASE);
  console.log('  - Firebase configured:', isFirebaseConfigured);
  console.log('  - Final decision:', shouldUseFirebase ? 'Firebase' : 'Mock');
  console.log('  - Services:', shouldUseFirebase ? 'Firebase' : 'Mock');
  console.log('  - Menu:', 'Mock (not implemented yet)');
  console.log('  - Requests:', 'Mock (not implemented yet)');
  console.log('  - Auth:', 'Mock (not implemented yet)');
}

export const menuRepo = shouldUseFirebase ? /* menuRepoFirebase */ menuRepoMock : menuRepoMock;
export const servicesRepo = shouldUseFirebase ? servicesRepoFirebase : servicesRepoMock;
export const requestsRepo = shouldUseFirebase ? /* requestsRepoFirebase */ requestsRepoMock : requestsRepoMock;
export const authService = shouldUseFirebase ? /* authFirebase */ authMock : authMock;