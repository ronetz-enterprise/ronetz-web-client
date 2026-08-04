import { useState, useEffect, useCallback } from "react";
import { paymentMethodApi } from "@/modules/payments/api/paymentMethodApi";
import type { PaymentMethod } from "../types";
import { toast } from "sonner";

export const usePaymentMethods = (countryCode?: string) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMethods = useCallback(async () => {
    if (!countryCode) {
      setPaymentMethods([]);
      return;
    }

    setLoading(true);
    try {
      const data = await paymentMethodApi.getByCountry(countryCode);
      setPaymentMethods(data.filter(m => m.active));
    } catch (error) {
      toast.error("Erreur lors du chargement des modes de paiement");
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  return { paymentMethods, loading, refresh: fetchMethods };
};
