import { USE_FIREBASE } from "@/lib/registry";
import { menuRepoMock } from "@/lib/adapters/mock/menu.adapter";
import { servicesRepoMock } from "@/lib/adapters/mock/services.adapter";
import { requestsRepoMock } from "@/lib/adapters/mock/requests.adapter";
import { authMock } from "@/lib/adapters/mock/auth.adapter";

// Firebase adapters
import { servicesRepoFirebase } from "@/lib/adapters/firebase/services.adapter";
// import { menuRepoFirebase } from "@/lib/adapters/firebase/menu.adapter";
// import { requestsRepoFirebase } from "@/lib/adapters/firebase/requests.adapter";
// import { authFirebase } from "@/lib/adapters/firebase/auth.adapter";

if (__DEV__) {
  console.log('[Repositories] Repository providers:');
  console.log('  - Services:', USE_FIREBASE ? 'Firebase' : 'Mock');
  console.log('  - Menu:', 'Mock (not implemented yet)');
  console.log('  - Requests:', 'Mock (not implemented yet)');
  console.log('  - Auth:', 'Mock (not implemented yet)');
}

export const menuRepo = USE_FIREBASE ? /* menuRepoFirebase */ menuRepoMock : menuRepoMock;
export const servicesRepo = USE_FIREBASE ? servicesRepoFirebase : servicesRepoMock;
export const requestsRepo = USE_FIREBASE ? /* requestsRepoFirebase */ requestsRepoMock : requestsRepoMock;
export const authService = USE_FIREBASE ? /* authFirebase */ authMock : authMock;