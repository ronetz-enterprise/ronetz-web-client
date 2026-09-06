import { useState, useEffect, useCallback } from 'react';
import { logApi } from '@/modules/analytics-audit/api/logApi';
import type { SystemLog } from '../types';
import { toast } from 'sonner';

export const useLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await logApi.getLogs();
      setLogs(data);
    } catch (error) {
      setError("Impossible de charger les données. Réessayez.");
      toast.error('Erreur lors du chargement des logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { error, logs, loading, refresh: fetchLogs };
};
