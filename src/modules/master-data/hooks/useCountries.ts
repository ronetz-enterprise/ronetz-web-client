import { useState, useEffect, useCallback } from 'react';
import { countryApi } from '@/modules/master-data/api/countryApi';
import { type Country } from '../types';
import { toast } from 'sonner';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await countryApi.getAll();
      setCountries(data);
    } catch (error) {
      setError("Impossible de charger les données. Réessayez.");
      toast.error("Erreur lors du chargement des pays");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createCountry = async (country: Partial<Country>) => {
    try {
      await countryApi.create(country);
      toast.success("Pays créé avec succès");
      refresh();
    } catch (error) {
      toast.error("Erreur lors de la création du pays");
      throw error;
    }
  };

  const toggleCountryBlock = useCallback(async (id: string) => {
    try {
      await countryApi.toggleBlock(id);
      toast.success("Pays mis à jour");
      refresh();
    } catch {
      toast.error("Impossible de modifier l'accès pour ce pays");
    }
  }, [refresh]);

  return { error, countries, loading, createCountry, refresh, toggleCountryBlock };
}
