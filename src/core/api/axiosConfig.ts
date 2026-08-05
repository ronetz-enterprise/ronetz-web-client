import axios from "axios";
import { authApi } from "@/modules/auth/api/authApi";
import { useAuthStore } from "@/modules/auth/store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const AUTH_ROUTES = ["/login", "/register"];

api.interceptors.request.use(async (config) => {
  const isAuthRoute = AUTH_ROUTES.some((route) => config.url?.includes(route));
  if (!isAuthRoute) {
    // authApi.getAccessToken() returns the current Firebase ID token,
    // refreshing it transparently if it's close to expiry — no manual
    // refresh-token bookkeeping needed on this side anymore.
    const token = await authApi.getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;

      const tenantId = useAuthStore.getState().user?.tenantId;
      if (tenantId) config.headers["X-Tenant-Id"] = tenantId;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // A 401 here means the backend rejected the current ID token (expired
    // past what Firebase could silently refresh, revoked, disabled
    // account...) — treat the session as dead rather than retrying it.
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
