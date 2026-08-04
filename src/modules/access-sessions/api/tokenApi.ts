import api from "@/core/api/axiosConfig";
import type { TokenDto, TokenUsageDto } from "../types";

export const tokenApi = {
  getMine: () => api.get<TokenDto[]>("/api/tokens"),

  getUsage: (id: string) => api.get<TokenUsageDto>(`/api/tokens/${id}/usage`),

  revoke: (id: string) => api.delete<void>(`/api/tokens/${id}`),
};
