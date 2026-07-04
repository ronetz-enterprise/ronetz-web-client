import { useState, useEffect, useCallback } from "react";
import { tokenApi } from "@/core/api/endpoints/tokenApi";
import type { TokenDto } from "@/shared/types";
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

  useEffect(() => { refresh(); }, [refresh]);

  return { tokens, loading, refresh };
};
