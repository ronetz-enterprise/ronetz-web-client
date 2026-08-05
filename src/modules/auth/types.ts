import type { UserRole } from "@/shared/types";

/** Credentials required to authenticate, regardless of the identity provider. */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Data required to create a new account — deliberately limited to what the
 * Firebase Auth model itself supports (email/password + display name).
 * Anything else (phone, country, tenant...) is a profile concern to be
 * completed separately, after the Firebase account exists.
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/** Authenticated user, built from the provider's session claims. */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  domainId?: string;
  tenantId?: string;
  countryCode?: string;
}

/**
 * Result of a successful authentication. Same shape whatever the provider
 * (Firebase, another vendor, a custom backend) — everything above the
 * `AuthProvider` port only ever sees this.
 */
export interface AuthSession {
  user: User;
  /** Bearer token to attach to API calls (Firebase ID token, JWT, ...). */
  accessToken: string;
}
