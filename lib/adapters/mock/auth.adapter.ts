import { IAuthService, Session } from "@/lib/ports/auth.port";

export const authMock: IAuthService = {
  async getSession(): Promise<Session> { 
    return { uid: "mock-user", role: "guest" }; 
  },
  async signInWithEmail(): Promise<Session> { 
    return { uid: "mock-admin", role: "admin" }; 
  },
  async signOut() { 
    return; 
  },
};