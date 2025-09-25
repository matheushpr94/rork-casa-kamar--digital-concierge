import { menuRepoMock } from "@/lib/adapters/mock/menu.adapter";
import { servicesRepoMock } from "@/lib/adapters/mock/services.adapter";
import { requestsRepoMock } from "@/lib/adapters/mock/requests.adapter";
import { authMock } from "@/lib/adapters/mock/auth.adapter";

// For now, always use mock adapters to avoid bundling issues
// TODO: Implement Firebase adapters when needed

if (__DEV__) {
  console.log('[Repositories] Repository providers:');
  console.log('  - Final decision: Mock (Firebase disabled)');
  console.log('  - Services: Mock');
  console.log('  - Menu: Mock');
  console.log('  - Requests: Mock');
  console.log('  - Auth: Mock');
}

export const menuRepo = menuRepoMock;
export const servicesRepo = servicesRepoMock;
export const requestsRepo = requestsRepoMock;
export const authService = authMock;