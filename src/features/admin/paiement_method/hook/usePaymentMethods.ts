import { useState, useEffect, useCallback } from 'react';
import { paymentMethodApi } from '@/core/api/endpoints/paymentMethodApi';
import { type PaymentMethod } from '@/shared/types';
import { toast } from 'sonner';

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await paymentMethodApi.getAll();
      setPaymentMethods(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des méthodes de paiement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createPaymentMethod = async (paymentMethod: Partial<PaymentMethod>) => {
    try {
      await paymentMethodApi.create(paymentMethod);
      toast.success("Méthode de paiement créée avec succès");
      refresh();
    } catch (error) {
      toast.error("Erreur lors de la création de la méthode de paiement");
      throw error;
    }
  };

  return { paymentMethods, loading, createPaymentMethod, refresh };
}
