import { useState, useEffect, useCallback } from 'react';
import { siteApi } from '@/api/endpoints/siteApi';
import type { Site } from '@/shared/types';
import { toast } from 'sonner';

export const useSites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await siteApi.getAll();
      setSites(data);
    } catch (error) {
      toast.error('Impossible de charger les sites');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSite = async (data: Partial<Site>) => {
    try {
      await siteApi.create(data);
      toast.success('Site créé avec succès');
      fetchSites();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const updateSite = async (id: string, data: Partial<Site>) => {
    try {
      await siteApi.update(id, data);
      toast.success('Site mis à jour');
      fetchSites();
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteSite = async (id: string) => {
    try {
      await siteApi.delete(id);
      toast.success('Site supprimé');
      fetchSites();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return {
    sites,
    loading,
    refresh: fetchSites,
    createSite,
    updateSite,
    deleteSite
  };
};
