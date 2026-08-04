import api from "@/core/api/axiosConfig";
import type { SystemLog } from "../types";

export interface GetLogsParams {
  level?: string;
  component?: string;
  startDate?: string; // ISO string
  endDate?: string; // ISO string
}

export const logApi = {
  getLogs: (params?: GetLogsParams) =>
    api.get<SystemLog[]>("/api/admin/logs", { params }),
};
