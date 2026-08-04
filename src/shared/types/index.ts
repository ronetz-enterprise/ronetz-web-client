// Truly cross-cutting types (client-side "shared kernel"), used across module boundaries
// for RBAC and global HTTP error handling. Domain-specific DTOs live in each module's
// own `types.ts` (see src/modules/*/types.ts), mirroring the backend bounded contexts.

export type UserRole = "CLIENT" | "ADMIN_WIFI" | "SUPER_ADMIN";

export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}
