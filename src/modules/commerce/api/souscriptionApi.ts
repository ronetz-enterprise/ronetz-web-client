import api from "@/core/api/axiosConfig";
import type { SubscriptionDto } from "../types";
import { mockResponse } from "@/core/api/mockResponse";
import { mockSubscriptions, mockCreateSubscription, mockCancelSubscription } from "./souscriptionApi.mock";
import { mockForfaits } from "./forfaitApi.mock";

export interface CreateSubscriptionRequest {
  productId: string;
  siteId: string;
}

// See VITE_MOCK_CLIENT_DATA in forfaitApi.ts.
const USE_MOCK_CLIENT_DATA = import.meta.env.VITE_MOCK_CLIENT_DATA === "true";

export const souscriptionApi = {
  create: (data: CreateSubscriptionRequest) => {
    if (USE_MOCK_CLIENT_DATA) {
      const product = mockForfaits.find((f) => f.id === data.productId);
      const sub = mockCreateSubscription(data.productId, data.siteId, product?.price ?? 0, product?.currency ?? "XAF");
      return mockResponse(sub);
    }
    return api.post<SubscriptionDto>("/api/subscriptions", data);
  },

  getMine: () => (USE_MOCK_CLIENT_DATA ? mockResponse(mockSubscriptions) : api.get<SubscriptionDto[]>("/api/subscriptions")),

  cancel: (id: string) => {
    if (USE_MOCK_CLIENT_DATA) {
      mockCancelSubscription(id);
      return mockResponse(undefined as void);
    }
    return api.delete<void>(`/api/subscriptions/${id}`);
  },
};
