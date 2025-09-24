import { IAuthService, Session } from "@/lib/ports/auth.port";

// TODO: Implement Firebase Auth service
export const authFirebase: IAuthService = {
  async getSession(): Promise<Session> {
    // TODO: const user = auth.currentUser
    // TODO: if (!user) return null
    // TODO: const token = await user.getIdTokenResult()
    // TODO: return { uid: user.uid, role: token.claims.role || 'guest' }
    throw new Error("Firebase auth adapter not implemented yet");
  },
  async signInWithEmail(email: string, password: string): Promise<Session> {
    // TODO: const credential = await signInWithEmailAndPassword(auth, email, password)
    // TODO: const token = await credential.user.getIdTokenResult()
    // TODO: return { uid: credential.user.uid, role: token.claims.role || 'guest' }
    throw new Error("Firebase auth adapter not implemented yet");
  },
  async signOut(): Promise<void> {
    // TODO: await signOut(auth)
    throw new Error("Firebase auth adapter not implemented yet");
  },
};