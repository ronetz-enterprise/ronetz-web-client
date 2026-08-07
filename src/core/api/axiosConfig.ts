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
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      // A 401 means the backend rejected the current ID token outright (expired past what
      // Firebase could silently refresh, malformed...) — the session is dead.
      // A 403 is ambiguous on its own: it's also what a @PreAuthorize check returns when this
      // user's role just doesn't cover *this one action* (session otherwise fine, must not log
      // them out). FirebaseAuthenticationFilter tags the "your account was deactivated" case
      // specifically with X-Auth-Error so we only log out for that, not every 403.
      const accountDisabled = error.response?.headers?.["x-auth-error"] === "account-disabled";
      if (status === 401 || (status === 403 && accountDisabled)) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
