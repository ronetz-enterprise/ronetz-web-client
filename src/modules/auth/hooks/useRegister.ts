import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/endpoints/authApi';
import { toast } from 'sonner';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await authApi.signIn(data);
      toast.success('Compte créé avec succès ! Connectez-vous.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du compte');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
