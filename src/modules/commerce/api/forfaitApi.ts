import api from "@/core/api/axiosConfig";
import type { Forfait } from "../types";

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

export const forfaitApi = {
  // Any authenticated user: list all active products for the tenant
  getAll: (siteId:string|null)=>{ 
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
