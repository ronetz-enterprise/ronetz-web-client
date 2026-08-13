import api from "@/core/api/axiosConfig";
import type { Forfait } from "../types";
import { mockResponse } from "@/core/api/mockResponse";
import { mockForfaits } from "./forfaitApi.mock";

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  currency: string;
  durationMinutes: number;
  dataVolumeMb: number;
  maxConcurrentDevices: number;
  siteIds: string[];
}

export type UpdateProductRequest = CreateProductRequest;

// Set VITE_MOCK_CLIENT_DATA=true (.env) to serve the "client simple" interfaces
// (HomePage, ForfaitsAchatPage, PaiementPage, MesSouscriptionsPage, MesAccesPage) from
// fixtures instead of the real API — useful for reworking their UI without a backend
// running. See forfaitApi.mock.ts / souscriptionApi.mock.ts / tokenApi.mock.ts /
// paymentApi.mock.ts / paymentMethodApi.mock.ts. Every other consumer of these api
// modules (admin pages) is untouched — this only intercepts the methods below.
const USE_MOCK_CLIENT_DATA = import.meta.env.VITE_MOCK_CLIENT_DATA === "true";

export const forfaitApi = {
  // Any authenticated user: list all active products for the tenant
  getAll: (siteId:string|null)=>{
   if (USE_MOCK_CLIENT_DATA) {
     const data = siteId !== null ? mockForfaits.filter((f) => f.siteIds?.includes(siteId)) : mockForfaits;
     return mockResponse(data);
   }
   return  siteId!==null?
       api.get<Forfait[]>(`/api/products/${siteId}`):
       api.get<Forfait[]>(`/api/products`)

},

  create: (data: CreateProductRequest) => api.post<Forfait>("/api/products", data),

  update: (id: string, data: UpdateProductRequest) =>
    api.put<Forfait>(`/api/products/${id}`, data),

  delete: (id: string) => api.delete<void>(`/api/products/${id}`),

  toggleActive: (id: string) => api.patch<Forfait>(`/api/products/${id}/toggle-active`),
};
