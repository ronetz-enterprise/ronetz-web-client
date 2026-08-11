import api from "@/core/api/axiosConfig";
import type { UserDetails } from "../types";

export const userApi = {
  getAll: async (params?: { role?: string; active?: boolean }): Promise<UserDetails[]> => {
    const response = await api.get<UserDetails[]>("/api/users", { params });
    return response.data;
  },

  delete: (id: string) => api.delete<void>(`/api/users/${id}`),

  toggleStatus: async (id: string) => {
    const res = await api.patch<UserDetails>(`/api/users/${id}/toggle-status`);
    return res.data;
  },

  // Backend: PromoteUserCommand.organizationName (renamed from tenantName — the entity
  // created here is an Organization, not "a tenant" in the generic RLS-partition sense).
  grantToAdminWifi: async (id: string, organizationName: string) => {
    await api.patch<string>(`/api/users/${id}/promote-admin-wifi`, organizationName, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
