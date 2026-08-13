import type { UserRole } from "@/shared/types";

/** Landing route right after authentication, or when a role guard rejects access. */
export function getDefaultPathForRole(role: UserRole): string {
  switch (role) {
    case "CLIENT":
      return "/home";
    case "ADMIN_WIFI":
      return "/dashboard";
    case "SUPER_ADMIN":
      return "/admin/users";
  }
}
