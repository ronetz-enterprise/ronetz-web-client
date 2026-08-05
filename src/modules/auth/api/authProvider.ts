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
   * OAuth login (Google, and any other social provider added later).
   * Resolves to `null` — not an error — when the user dismisses the
   * popup/redirect without completing it.
   */
  loginWithGoogle(): Promise<AuthSession | null>;
  logout(): Promise<void>;
  /** Current bearer token, transparently refreshed (or forced to) if needed. */
  getAccessToken(forceRefresh?: boolean): Promise<string | null>;
  /**
   * Fires on sign-in, sign-out, and token refresh (so downstream claims like
   * role/tenantId/domainId stay in sync). Returns an unsubscribe function.
   */
  onSessionChanged(listener: (session: AuthSession | null) => void): () => void;
}
