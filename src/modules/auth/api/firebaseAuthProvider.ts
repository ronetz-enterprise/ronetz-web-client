import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type AuthProvider as FirebaseSocialProvider,
  type User as FirebaseUser,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

import { app } from "@/firebase";
import type { UserRole } from "@/shared/types";
import type { AuthProvider } from "./authProvider";
import type { AuthSession, LoginRequest, RegisterRequest, User } from "../types";

const auth = getAuth(app);

function isUserRole(role: unknown): role is UserRole {
  return role === "CLIENT" || role === "ADMIN_WIFI" || role === "SUPER_ADMIN";
}

/**
 * Builds the app's `AuthSession` from a Firebase user. Business claims
 * (role, tenantId, domainId, countryCode) are expected to be set
 * server-side as Firebase custom claims (Admin SDK) — the client never
 * assigns them itself, it only reads them back from the ID token.
 */
async function toSession(firebaseUser: FirebaseUser, forceRefresh = false): Promise<AuthSession> {
  const idToken = await firebaseUser.getIdToken(forceRefresh);
  const { claims } = await firebaseUser.getIdTokenResult(forceRefresh);

  const [claimFirstName, claimLastName] = firebaseUser.displayName?.split(" ") ?? [];

  const user: User = {
    id: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    role: isUserRole(claims.role) ? claims.role : "CLIENT",
    firstName: (claims.firstName as string | undefined) ?? claimFirstName,
    lastName: (claims.lastName as string | undefined) ?? claimLastName,
    tenantId: claims.tenantId as string | undefined,
    domainId: claims.domainId as string | undefined,
    countryCode: claims.countryCode as string | undefined,
  };

  return { user, accessToken: idToken };
}

/** Shared by loginWithGoogle/loginWithApple — same popup + cancellation handling either way. */
async function signInWithSocialPopup(provider: FirebaseSocialProvider): Promise<AuthSession | null> {
  try {
    const { user } = await signInWithPopup(auth, provider);
    // `forceRefresh`: this may be this user's first sign-in, so custom
    // claims might not exist yet.
    return toSession(user, true);
  } catch (error) {
    const cancelled =
      error instanceof FirebaseError &&
      (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request");
    if (cancelled) return null; // user dismissed the popup — not a real error
    throw error;
  }
}

export const firebaseAuthProvider: AuthProvider = {
  async login({ email, password }: LoginRequest) {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return toSession(user);
  },

  async register(data: RegisterRequest) {
    const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);
    await updateProfile(user, { displayName: data.name });

    // TODO(backend): role/tenantId/countryCode still need to be assigned as
    // custom claims server-side (Admin SDK), e.g. from an onCreate trigger.
    // `forceRefresh: true` below only helps if that's already done by the
    // time we get here; otherwise the user starts out as the default 'CLIENT'.
    return toSession(user, true);
  },

  loginWithGoogle() {
    return signInWithSocialPopup(new GoogleAuthProvider());
  },

  loginWithApple() {
    return signInWithSocialPopup(new OAuthProvider("apple.com"));
  },

  async checkEmailExists(email) {
    // The client SDK's fetchSignInMethodsForEmail always returns [] once
    // this project's "Email Enumeration Protection" is enabled — every
    // email then looks "new" to it. So this asks the backend instead
    // (GET /auth/email-exists, public route — see SecurityConfig), which
    // answers via the Admin SDK and isn't subject to that setting.
    //
    // Fails open to "no" on any error (network down, backend unreachable,
    // ...): the register-details step this feeds stays safe either way —
    // if a genuinely existing email lands there anyway, register() fails
    // with `auth/email-already-in-use` and the UI falls back to the login
    // step (see AuthForm's onSubmitRegister).
    try {
      const { data } = await axios.get<{ exists: boolean }>(
        `${import.meta.env.VITE_API_URL}/auth/email-exists`,
        { params: { email } }
      );
      return data.exists;
    } catch {
      return false;
    }
  },

  async logout() {
    await signOut(auth);
  },

  async getAccessToken(forceRefresh = false) {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  },

  onSessionChanged(listener) {
    return onIdTokenChanged(auth, async (firebaseUser) => {
      listener(firebaseUser ? await toSession(firebaseUser) : null);
    });
  },
};
