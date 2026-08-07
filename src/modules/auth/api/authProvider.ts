import type { AuthSession, LoginRequest, RegisterRequest } from "../types";

/**
 * Contract for an identity provider (Firebase, Auth0, Cognito, a homegrown
 * backend...). Everything above this module — hooks, the auth store, the
 * HTTP client — depends on this interface only, never on a concrete SDK.
 * Swapping/adding a provider means writing one more implementation of it.
 */
export interface AuthProvider {
  login(credentials: LoginRequest): Promise<AuthSession>;
  register(data: RegisterRequest): Promise<AuthSession>;
  /**
   * OAuth login (Google, Apple, and any other social provider added later).
   * Resolves to `null` — not an error — when the user dismisses the
   * popup/redirect without completing it.
   */
  loginWithGoogle(): Promise<AuthSession | null>;
  loginWithApple(): Promise<AuthSession | null>;
  /**
   * Whether an account already exists for this email — drives the
   * email-first flow's branch into "enter password" vs "create account".
   * Best-effort: a provider may not be able to answer this precisely, or
   * at all (network/backend failure — see the Firebase adapter's note), in
   * which case it should default to "no" and let the create-account step's
   * own duplicate-email error correct course.
   */
  checkEmailExists(email: string): Promise<boolean>;
  logout(): Promise<void>;
  /** Current bearer token, transparently refreshed (or forced to) if needed. */
  getAccessToken(forceRefresh?: boolean): Promise<string | null>;
  /**
   * Fires on sign-in, sign-out, and token refresh (so downstream claims like
   * role/tenantId/domainId stay in sync). Returns an unsubscribe function.
   */
  onSessionChanged(listener: (session: AuthSession | null) => void): () => void;
}
