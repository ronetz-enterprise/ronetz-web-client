import axios from "axios";
import type { ApiErrorResponse } from "@/shared/types";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as unknown;
  if (!data || typeof data !== "object") return fallback;
  const maybe = data as Partial<ApiErrorResponse>;
  if (typeof maybe.message === "string" && maybe.message.trim().length > 0) return maybe.message;
  return fallback;
}

