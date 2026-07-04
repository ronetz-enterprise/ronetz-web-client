import { useState, useEffect, useCallback } from "react";
import { souscriptionApi } from "@/core/api/endpoints/souscriptionApi";
import type { SubscriptionDto } from "@/shared/types";
import { toast } from "sonner";

export const useMesSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionDto[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await souscriptionApi.getMine();
      setSubscriptions(data);
    } catch {
      toast.error("Erreur lors du chargement des souscriptions");
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (id: string) => {
    try {
      await souscriptionApi.cancel(id);
      toast.success("Souscription annulée");
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      toast.error("Impossible d'annuler cette souscription");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { subscriptions, loading, refresh, cancel };
};
