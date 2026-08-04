import api from "@/core/api/axiosConfig";
import type { SubscriptionDto } from "../types";

export interface CreateSubscriptionRequest {
  productId: string;
  siteId: string;
}

export const souscriptionApi = {
  create: (data: CreateSubscriptionRequest) =>
    api.post<SubscriptionDto>("/api/subscriptions", data),

  getMine: () =>
    api.get<SubscriptionDto[]>("/api/subscriptions"),

  cancel: (id: string) =>
    api.delete<void>(`/api/subscriptions/${id}`),
};
