import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { getJwtPayload, type JwtPayload } from '@/shared/hooks/jwtUtil';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/refresh",
];

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function getStoredAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

function getStoredRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}



api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  
  const jwtPayload:JwtPayload|null = getJwtPayload(token!);
  const tenantId = jwtPayload?.tenantId;
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    config.url?.includes(route)
  );

  if (token && !isAuthRoute) {
    config.headers = config.headers ?? {};
   config.headers['X-Tenant-Id'] = tenantId;
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Interception de la requette: Configuration: "+config);
  return config;
});

let isRefreshing = false;
let refreshWaiters: Array<(token: string | null) => void> = [];

function notifyWaiters(token: string | null) {
  refreshWaiters.forEach((cb) => cb(token));
  refreshWaiters = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    console.log("=== ERREUR BRUTE DU BACKEND ===");
    console.log("Status:", error.response?.status);
    console.log("Headers:", error.response?.headers);
    console.log("Data:", error.response?.data);
    console.log(error);

    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original) throw error;
    if (original._retry) throw error;

    if (error.response?.status !== 401) throw error;

    console.log("3");

    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) throw error;

    console.log("4");

    if (isRefreshing) {
      const newToken = await new Promise<string | null>((resolve) => {
        refreshWaiters.push(resolve);
      });

      if (!newToken) throw error;

      original._retry = true;
      original.headers = original.headers ?? {};
      (original.headers as Record<string, string>).Authorization =
        `Bearer ${newToken}`;

      return api.request(original);
    }

    console.log("5");

    isRefreshing = true;
    original._retry = true;

    try {
      const resp = await refreshClient.post<{
        accessToken: string;
        refreshToken: string;
      }>("/auth/refresh", { refreshToken });

      localStorage.setItem("accessToken", resp.data.accessToken);
      localStorage.setItem("refreshToken", resp.data.refreshToken);

      notifyWaiters(resp.data.accessToken);

      original.headers = original.headers ?? {};
      (original.headers as Record<string, string>).Authorization =
        `Bearer ${resp.data.accessToken}`;

      return api.request(original);
    } catch (e) {
      notifyWaiters(null);
      throw e;
    } finally {
      isRefreshing = false;
    }
  }
);
export default api;
