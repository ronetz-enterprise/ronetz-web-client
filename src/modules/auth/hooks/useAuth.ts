import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/endpoints/authApi';
import { useAuthStore } from '@/shared/store/authStore';
import { toast } from 'sonner';

import type { LoginRequest } from '../api/type';
import { getJwtPayload, type JwtPayload } from '@/shared/hooks/jwtUtil';
import type { User } from '@/shared/types';
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      const { accessToken, refreshToken } = response.data;
      setTokens(accessToken, refreshToken);
      toast.success('Connexion réussie');
      const userJwt: JwtPayload | null = getJwtPayload(accessToken);
      const user: User | null = {
        id: userJwt?.sub || '',
        name: '',
        email: userJwt?.email || '',
        role: userJwt?.role || '',
        statut: 'ACTIF',
      }
      setUser(user);

      const defaultPath = user?.role === 'CLIENT' ? '/jetons' :
        user?.role === 'ADMIN_WIFI' ? '/sites' : user?.role === 'ADMIN' ?
          '/admin/users' : '/login';
      navigate(defaultPath);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Identifiants invalides');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
