import { useState, useEffect, useCallback } from "react";
import { siteApi } from "@/modules/network-ops/api/siteApi";
import type { Site } from "../types";
import { toast } from "sonner";

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await siteApi.getSites();
      setSites(data);
    } catch {
      setError("Impossible de charger les données. Réessayez.");
      toast.error("Impossible de charger les sites");
      setSites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSite = async (data: Pick<Site, "name" | "address" | "countryCode">) => {
    try {
      await siteApi.createSite(data);
      toast.success("Site créé avec succès");
      fetchSites();
    } catch {
      toast.error("Erreur lors de la création du site");
    }
  };

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return { error,
    sites,
    loading,
    refresh: fetchSites,
    createSite,
  };
};
