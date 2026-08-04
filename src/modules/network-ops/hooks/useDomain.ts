import { useState, useEffect, useCallback } from "react";
import { siteApi } from "@/modules/network-ops/api/siteApi";

export const useDomains = () => {
  const [exist, setExist] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const checkDomain = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await siteApi.checkTenantHasDomain();

      setExist(true);
    } catch (err) {
      // Ignore abort error
      if ((err as any)?.name === "AbortError") return;

      console.error("checkDomain error:", err);
      setError(err);
      setExist(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkDomain();
  }, [checkDomain]);

  return {
    exist,
    loading,
    error,
    refetch: checkDomain,
  };
};