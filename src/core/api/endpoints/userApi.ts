import api from "@/core/api/axiosConfig";
import type { UserDetails } from "@/shared/types";

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

  grantToAdminWifi: async (id: string, tenantName: string) => {
    await api.patch<string>(`/api/users/${id}/promote-admin-wifi`, tenantName, {
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
