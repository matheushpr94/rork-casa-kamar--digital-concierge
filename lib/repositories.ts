import { USE_FIREBASE } from "@/lib/registry";
import { menuRepoMock } from "@/lib/adapters/mock/menu.adapter";
import { servicesRepoMock } from "@/lib/adapters/mock/services.adapter";
import { requestsRepoMock } from "@/lib/adapters/mock/requests.adapter";
import { authMock } from "@/lib/adapters/mock/auth.adapter";

// Future Firebase adapters will be imported here:
// import { menuRepoFirebase } from "@/lib/adapters/firebase/menu.adapter";
// import { servicesRepoFirebase } from "@/lib/adapters/firebase/services.adapter";
// import { requestsRepoFirebase } from "@/lib/adapters/firebase/requests.adapter";
// import { authFirebase } from "@/lib/adapters/firebase/auth.adapter";

export const menuRepo = USE_FIREBASE ? /* menuRepoFirebase */ menuRepoMock : menuRepoMock;
export const servicesRepo = USE_FIREBASE ? /* servicesRepoFirebase */ servicesRepoMock : servicesRepoMock;
export const requestsRepo = USE_FIREBASE ? /* requestsRepoFirebase */ requestsRepoMock : requestsRepoMock;
export const authService = USE_FIREBASE ? /* authFirebase */ authMock : authMock;