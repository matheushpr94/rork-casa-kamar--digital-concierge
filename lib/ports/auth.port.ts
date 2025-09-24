export type UserRole = "guest" | "admin";

export type Session = { uid: string; role: UserRole } | null;

export interface IAuthService {
  getSession(): Promise<Session>;
  signInWithEmail(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
}