import { useState, useEffect, useCallback } from 'react';
import { forfaitApi } from '@/api/endpoints/forfaitApi';
import type { Forfait } from '@/shared/types';
import { toast } from 'sonner';

export const useForfaits = () => {
  const [forfaits, setForfaits] = useState<Forfait[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForfaits = useCallback(async (siteId?: string) => {
    setLoading(true);
    try {
      const { data } = siteId 
        ? await forfaitApi.getBySite(siteId)
        : await forfaitApi.getAll();
      setForfaits(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des forfaits');
    } finally {
      setLoading(false);
    }
  }, []);

  const createForfait = async (data: Partial<Forfait>) => {
    try {
      await forfaitApi.create(data);
      toast.success('Forfait créé avec succès');
      fetchForfaits();
    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const deleteForfait = async (id: string) => {
    try {
      await forfaitApi.delete(id);
      toast.success('Forfait supprimé');
      fetchForfaits();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    // Default fetch all if not specific site
    fetchForfaits();
  }, [fetchForfaits]);

  return {
    forfaits,
    loading,
    refresh: fetchForfaits,
    createForfait,
    deleteForfait
  };
};
