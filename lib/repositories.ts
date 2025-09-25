import { menuRepoFirebase } from "@/lib/adapters/firebase/menu.adapter";
import { servicesRepoFirebase } from "@/lib/adapters/firebase/services.adapter";
import { requestsRepoFirebase } from "@/lib/adapters/firebase/requests.adapter";
import { authFirebase } from "@/lib/adapters/firebase/auth.adapter";

if (__DEV__) {
  console.log('[Repositories] Using Firebase');
}

export const menuRepo = menuRepoFirebase;
export const servicesRepo = servicesRepoFirebase;
export const requestsRepo = requestsRepoFirebase;
export const authService = authFirebase;