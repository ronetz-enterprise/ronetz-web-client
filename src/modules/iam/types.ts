// Domain model for the IAM bounded context (mirrors backend bc-iam DTOs).
import type { UserRole } from "@/shared/types";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string; // UUID (jwt subject)
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  domainId?: string;
  tenantId?: string;
  countryCode?: string;
}

export interface UserDetails {
  id: string; // UUID
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  countryCode?: string | null;
  role: string;
  active: boolean;
  createdAt: string; // Instant (ISO string)
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  rawPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  /** ISO alpha code; must match backend `countryIsoCode`. */
  countryIsoCode: string;
  userMacAddress?: string;
}
