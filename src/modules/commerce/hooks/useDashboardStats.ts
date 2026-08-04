import { useState, useEffect, useCallback } from "react";
import { statsApi, type DashboardStats } from "@/modules/commerce/api/statsApi";
import { toast } from "sonner";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await statsApi.getDashboard();
      setStats(data);
    } catch {
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { stats, loading, refresh: fetch };
};
