import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { authApi } from '@/modules/auth/api/authApi';
import { getAuthErrorMessage } from '../lib/authError';
import { getDefaultPathForRole } from '../lib/roleRedirect';
import type { AuthSession, LoginRequest } from '../types';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Shared by login/loginWithGoogle/loginWithApple: run the call, navigate
  // on a real session, stay put on a `null` (popup dismissed) — no error to
  // show either way — and translate anything else into a toast.
  const runLogin = async (
    action: () => Promise<AuthSession | null>,
    fallbackError: string
  ) => {
    setIsLoading(true);
    try {
      const session = await action();
      if (!session) return; // popup dismissed by the user — nothing to do
      toast.success('Connexion réussie');
      navigate(getDefaultPathForRole(session.user.role));
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error, fallbackError));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = (data: LoginRequest) => runLogin(() => authApi.login(data), 'Identifiants invalides');
  const loginWithGoogle = () => runLogin(() => authApi.loginWithGoogle(), 'Connexion Google impossible');
  const loginWithApple = () => runLogin(() => authApi.loginWithApple(), 'Connexion Apple impossible');

  const checkEmailExists = async (email: string) => {
    setIsLoading(true);
    try {
      return await authApi.checkEmailExists(email);
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error, 'Impossible de vérifier cet email'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, loginWithGoogle, loginWithApple, checkEmailExists, isLoading };
};
