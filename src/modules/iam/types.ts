// Domain model for the IAM bounded context (mirrors backend bc-iam DTOs).

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

