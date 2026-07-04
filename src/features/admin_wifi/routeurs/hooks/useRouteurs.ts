import { useState, useEffect, useCallback } from "react";
import { routeurApi } from "@/core/api/endpoints/routeurApi";
import type { Routeur } from "@/shared/types";
import { toast } from "sonner";
export const useRouteurs = () => {
  const [routeurs, setRouteurs] = useState<Routeur[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRouteurs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await routeurApi.list();
      console.log("liste routeur");
      console.log(data);
      setRouteurs(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des routeurs");
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadConfig = async (id: string, name: string) => {
    try {
      const { data } = await routeurApi.downloadConfig(id);
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `config-${name}.rsc`);
      document.body.appendChild(link);
      link.click();
      toast.success("Configuration téléchargée");
    } catch (error) {
      toast.error("Échec du téléchargement");
    }
  };

  const createRouteur = async (data: Pick<Routeur, "name" | "siteId">) => {
    try {
     const roueur= await routeurApi.create(data);
     console.log(roueur);

      toast.success("Routeur créé avec succès");
      fetchRouteurs();
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const deleteRouteur = async (id: string) => {
    try {
      await routeurApi.delete(id);
      toast.success("Routeur supprimé");
      fetchRouteurs();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const activateRouteur = async (id: string) => {
    try {
      const { data } = await routeurApi.activate(id);
      toast.success("Routeur activé");
      setRouteurs((prev) => prev.map((r) => (r.id === id ? data : r)));
    } catch (error) {
      toast.error("Échec de l'activation");
    }
  };

  const rotateSecrets = async (id: string) => {
    try {
      const { data } = await routeurApi.rotateSecrets(id);
      toast.success("Secrets régénérés");
      setRouteurs((prev) => prev.map((r) => (r.id === id ? data : r)));
    } catch (error) {
      toast.error("Échec de la rotation des secrets");
    }
  };

  useEffect(() => {
    fetchRouteurs();
  }, [fetchRouteurs]);

  return {
    routeurs,
    loading,
    refresh: fetchRouteurs,
    createRouteur,
    downloadConfig,
    deleteRouteur,
    activateRouteur,
    rotateSecrets,
  };
};
