 import api from '../axiosConfig'; 
import type { LoginRequest, SignInRequest } from '@/modules/auth/api/type';
import type { AuthResponse } from '@/shared/types';

export const authApi = {
  login: async (credentials: LoginRequest)=>api.post("/auth/login",credentials),
  
  signIn: async (_data: SignInRequest) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { data: { success: true } };
  },

  logout: async () => {
    return new Promise(resolve => setTimeout(resolve, 500));
  }
};
