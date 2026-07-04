import api from "../axiosConfig";
import type { LoginRequest, SignInRequest } from "@/features/auth/types/type";
import type { AuthResponse } from "@/shared/types";

export const authApi = {
  login: (credentials: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", {
      email: credentials.email,
      password: credentials.rawPassword,
    }),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>("/auth/refresh", { refreshToken }),

  register: (data: SignInRequest) =>
    api.post<{ id: string; email: string; role: string }>("/auth/register", {
      email: data.email,
      phoneE164: data.phoneNumber,
      password: data.rawPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      countryCode: data.countryIsoCode,
    }),
};
