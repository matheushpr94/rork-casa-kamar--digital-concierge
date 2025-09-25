import { IAuthService, Session } from "@/lib/ports/auth.port";
import { isFirebaseConfigured } from "@/lib/firebase";

export const authFirebase: IAuthService = {
  async getSession(): Promise<Session> {
    if (!isFirebaseConfigured) {
      if (__DEV__) {
        console.log('[Firebase Auth] Firebase config missing — returning guest session');
      }
      return { uid: 'guest-user', role: 'guest' };
    }
    
    // TODO: const user = auth.currentUser
    // TODO: if (!user) return null
    // TODO: const token = await user.getIdTokenResult()
    // TODO: return { uid: user.uid, role: token.claims.role || 'guest' }
    return { uid: 'guest-user', role: 'guest' };
  },
  
  async signInWithEmail(email: string, password: string): Promise<Session> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: const credential = await signInWithEmailAndPassword(auth, email, password)
    // TODO: const token = await credential.user.getIdTokenResult()
    // TODO: return { uid: credential.user.uid, role: token.claims.role || 'guest' }
    throw new Error("Firebase auth signInWithEmail not implemented yet");
  },
  
  async signOut(): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }
    
    // TODO: await signOut(auth)
    throw new Error("Firebase auth signOut not implemented yet");
  },
};

if (__DEV__) {
  console.log('[Firebase Auth] Adapter initialized');
}