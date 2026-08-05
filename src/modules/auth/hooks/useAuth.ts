import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { authApi } from '@/modules/auth/api/authApi';
import { getAuthErrorMessage } from '../lib/authError';
import { getDefaultPathForRole } from '../lib/roleRedirect';
import type { LoginRequest } from '../types';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      // authApi.onSessionChanged (subscribed once in the auth store) takes
      // care of populating `useAuthStore` — this hook only needs the
      // session to decide where to navigate.
      const session = await authApi.login(data);
      toast.success('Connexion réussie');
      navigate(getDefaultPathForRole(session.user.role));
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error, 'Identifiants invalides'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const session = await authApi.loginWithGoogle();
      if (!session) return; // popup dismissed by the user — nothing to do
      toast.success('Connexion réussie');
      navigate(getDefaultPathForRole(session.user.role));
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error, 'Connexion Google impossible'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, loginWithGoogle, isLoading };
};
