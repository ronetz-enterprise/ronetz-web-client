import type { AxiosResponse } from "axios";
import api from "@/core/api/axiosConfig";
import type { Routeur } from "../types";
import { mockRouteurs } from "./routeurApi.mock";

export type CreateRouteurRequest = Pick<Routeur, "name" | "siteId">;
export type UpdateRouteurRequest = Pick<Routeur, "name"> & { vpnIp?: string | null };

// Set VITE_MOCK_ROUTEURS=true (.env / .env.local) to serve the router list
// from routeurApi.mock.ts instead of calling /api/routers — useful for
// working on the routers table (sorting, search, pagination) without a
// backend running. Every other routeurApi method still hits the real API.
const USE_MOCK_ROUTEURS = import.meta.env.VITE_MOCK_ROUTEURS === "true";

function mockListResponse(): Promise<AxiosResponse<Routeur[]>> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: mockRouteurs,
          status: 200,
          statusText: "OK",
          headers: {},
          config: {} as AxiosResponse["config"],
        }),
      400
    )
  );
}

export const routeurApi = {
  list: () => (USE_MOCK_ROUTEURS ? mockListResponse() : api.get<Routeur[]>("/api/routers")),

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
