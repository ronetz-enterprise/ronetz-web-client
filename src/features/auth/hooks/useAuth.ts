import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/core/api/endpoints/authApi';
import { useAuthStore } from '@/shared/store/authStore';
import { toast } from 'sonner';

import type { LoginRequest } from '../types/type';
import { getJwtPayload, type JwtPayload } from '@/shared/hooks/jwtUtil';
import type { User, UserRole } from '@/shared/types';
import { getApiErrorMessage } from '@/shared/lib/apiError';

function isUserRole(role: string | undefined): role is UserRole {
  return role === 'CLIENT' || role === 'ADMIN_WIFI' || role === 'SUPER_ADMIN';
}
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
      console.log("user jwt", userJwt);
      const role = isUserRole(userJwt?.role) ? userJwt?.role : 'CLIENT';
      console.log(role);
      const user: User = {
        id: userJwt?.sub ?? '',
        email: userJwt?.email ?? '',
        role,
        tenantId: userJwt?.tenantId,
        firstName: userJwt?.firstName,
        lastName: userJwt?.lastName,
        domainId: userJwt?.domainId,
        countryCode: userJwt?.countryCode,
      };
      setUser(userJwt ? user : null);

      const defaultPath =
        user?.role === 'CLIENT'
          ? '/souscriptions'
          : user?.role === 'ADMIN_WIFI'
            ? '/sites'
            : user?.role === 'SUPER_ADMIN'
              ? '/admin/users'
              : '/login';
      navigate(defaultPath);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Identifiants invalides'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
