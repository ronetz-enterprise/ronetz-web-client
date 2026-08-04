import { useState, useEffect, useCallback } from "react";
import { tokenApi } from "@/modules/access-sessions/api/tokenApi";
import type { TokenDto } from "../types";
import { toast } from "sonner";

export const useMyTokens = () => {
  const [tokens, setTokens] = useState<TokenDto[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tokenApi.getMine();
      setTokens(data);
    } catch {
      toast.error("Erreur lors du chargement des accès WiFi");
    } finally {
      setLoading(false);
    }
  }, []);

  const revoke = useCallback(async (id: string) => {
    try {
      await tokenApi.revoke(id);
      toast.success("Accès WiFi déconnecté");
      setTokens((prev) => prev.map((t) => (t.id === id ? { ...t, status: "REVOKED" } : t)));
    } catch {
      toast.error("Impossible de déconnecter cet accès");
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { tokens, loading, refresh, revoke };
};
