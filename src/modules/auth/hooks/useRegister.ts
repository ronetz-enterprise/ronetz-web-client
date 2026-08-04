import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/modules/auth/api/authApi';
import { toast } from 'sonner';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { getJwtPayload } from '@/shared/hooks/jwtUtil';
import type { UserRole } from '@/shared/types';
import type { User, SignInRequest } from '../../auth/types';
import { getApiErrorMessage } from '@/shared/lib/apiError';

function isUserRole(role: string | undefined): role is UserRole {
  return role === 'CLIENT' || role === 'ADMIN_WIFI' || role === 'SUPER_ADMIN';
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setTokens, setUser } = useAuthStore();

  const register = async (data: SignInRequest) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      const loginResp = await authApi.login({ email: data.email, password: data.rawPassword });
      const { accessToken, refreshToken } = loginResp.data;
      setTokens(accessToken, refreshToken);

      const payload = getJwtPayload(accessToken);
      const role = isUserRole(payload?.role) ? payload?.role : 'CLIENT';
      const user: User = {
        id: payload?.sub ?? '',
        email: payload?.email ?? data.email,
        role,
        firstName: payload?.firstName ?? data.firstName,
        countryCode: payload?.countryCode,
      };
      setUser(payload ? user : null);

      toast.success('Compte créé avec succès');
      navigate('/souscriptions');
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Erreur lors de la création du compte'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
