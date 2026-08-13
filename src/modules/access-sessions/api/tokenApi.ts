import api from "@/core/api/axiosConfig";
import type { TokenDto, TokenUsageDto } from "../types";
import { mockResponse } from "@/core/api/mockResponse";
import { mockTokens, mockUsageByTokenId, mockRevokeToken } from "./tokenApi.mock";

// See VITE_MOCK_CLIENT_DATA in forfaitApi.ts.
const USE_MOCK_CLIENT_DATA = import.meta.env.VITE_MOCK_CLIENT_DATA === "true";

export const tokenApi = {
  getMine: () => (USE_MOCK_CLIENT_DATA ? mockResponse(mockTokens) : api.get<TokenDto[]>("/api/tokens")),

  getUsage: (id: string) => {
    if (USE_MOCK_CLIENT_DATA) {
      const usage = mockUsageByTokenId[id] ?? null;
      if (!usage) return Promise.reject(new Error(`No mock usage for token ${id}`));
      return mockResponse(usage);
    }
    return api.get<TokenUsageDto>(`/api/tokens/${id}/usage`);
  },

  revoke: (id: string) => {
    if (USE_MOCK_CLIENT_DATA) {
      mockRevokeToken(id);
      return mockResponse(undefined as void);
    }
    return api.delete<void>(`/api/tokens/${id}`);
  },
};
