import { useState, useEffect, useCallback } from 'react';
import { logApi } from '@/modules/analytics-audit/api/logApi';
import type { SystemLog } from '../types';
import { toast } from 'sonner';

export const useLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await logApi.getLogs();
      setLogs(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des logs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, refresh: fetchLogs };
};
