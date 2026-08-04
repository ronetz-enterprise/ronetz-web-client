import api from "@/core/api/axiosConfig";
import type { Routeur } from "../types";

export type CreateRouteurRequest = Pick<Routeur, "name" | "siteId">;
export type UpdateRouteurRequest = Pick<Routeur, "name"> & { vpnIp?: string | null };

export const routeurApi = {
  list: () => api.get<Routeur[]>("/api/routers"),

  getBySite: (siteId: string) =>
    api.get<Routeur[]>(`/api/routers/site/${siteId}`),

  create: (data: CreateRouteurRequest) => api.post<Routeur>("/api/routers", data),

  update: (id: string, data: UpdateRouteurRequest) =>
    api.put<Routeur>(`/api/routers/${id}`, data),

  delete: (id: string) => api.delete<void>(`/api/routers/${id}`),

  downloadConfig: (id: string) =>
    api.get<Blob>(`/api/routers/${id}/config`, { responseType: "blob" }),

  heartbeat: (id: string) => api.post<void>(`/api/routers/${id}/heartbeat`),

  activate: (id: string) => api.put<Routeur>(`/api/routers/${id}/activate`),

  rotateSecrets: (id: string) => api.post<Routeur>(`/api/routers/${id}/rotate-secrets`),
};
