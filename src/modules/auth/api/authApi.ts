import type { AuthProvider } from "./authProvider";
import { firebaseAuthProvider } from "./firebaseAuthProvider";

/**
 * Active identity provider for the whole app. Every consumer (hooks, the
 * auth store, the axios client) imports `authApi` typed as `AuthProvider`
 * only — swapping Firebase for another provider means changing this one
 * binding, nothing else.
 */
export const authApi: AuthProvider = firebaseAuthProvider;
