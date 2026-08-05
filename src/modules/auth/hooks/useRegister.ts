import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { authApi } from '@/modules/auth/api/authApi';
import { getAuthErrorMessage } from '../lib/authError';
import type { RegisterRequest } from '../types';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      // Firebase signs the user in as part of account creation — no
      // separate login call needed; the auth store picks up the session
      // via authApi.onSessionChanged.
      await authApi.register(data);
      toast.success('Compte créé avec succès');
      navigate('/souscriptions');
    } catch (error: unknown) {
      toast.error(getAuthErrorMessage(error, 'Erreur lors de la création du compte'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
