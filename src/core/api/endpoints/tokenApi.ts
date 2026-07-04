import api from "@/core/api/axiosConfig";
import type { TokenDto } from "@/shared/types";

export const tokenApi = {
  getMine: () => api.get<TokenDto[]>("/api/tokens"),
};
