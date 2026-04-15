import { useState, useCallback } from 'react';
import { souscriptionApi } from '@/api/endpoints/souscriptionApi';
import type { Jeton } from '@/shared/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useSouscription = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const purchaseForfait = useCallback(async (forfaitId: string) => {
    setIsProcessing(true);
    try {
      // Mock simulation for payment delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const { data } = await souscriptionApi.create(forfaitId);
      toast.success('Paiement confirmé !');
      navigate('/confirmation', { state: { jeton: data.jeton } });
      return data.jeton;
    } catch (error) {
      toast.error('Échec du paiement');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [navigate]);

  return { purchaseForfait, isProcessing };
};

export const useJetons = () => {
  const [activeJetons, setActiveJetons] = useState<Jeton[]>([]);
  const [historique, setHistorique] = useState<Jeton[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJetons = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: actifs }, { data: hist }] = await Promise.all([
        souscriptionApi.getActifs(),
        souscriptionApi.getHistorique()
      ]);
      setActiveJetons(actifs);
      setHistorique(hist);
    } catch (error) {
      toast.error('Erreur lors de la récupération des jetons');
    } finally {
      setLoading(false);
    }
  }, []);

  return { activeJetons, historique, loading, refresh: fetchJetons };
};
