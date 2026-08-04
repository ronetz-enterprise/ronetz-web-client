import { useState, useEffect, useCallback } from "react";
import { forfaitApi } from "@/modules/commerce/api/forfaitApi";
import type { Forfait } from "../types";
import type { CreateProductRequest } from "@/modules/commerce/api/forfaitApi";
import { toast } from "sonner";

export const useForfaits = (siteId:string|null) => {
  const [forfaits, setForfaits] = useState<Forfait[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchForfaits = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await forfaitApi.getAll(siteId);
      console.log(data);
      setForfaits(data);
    } catch {
      toast.error("Erreur lors du chargement des forfaits");
    } finally {
      setLoading(false);
    }
  }, []);

  const createForfait = useCallback(async (data: CreateProductRequest) => {
    try {
      const res = await forfaitApi.create(data);
      toast.success("Forfait créé");
      setForfaits((prev) => [...prev, res.data]);
    } catch {
      toast.error("Erreur lors de la création du forfait");
    }
  }, []);

  const deleteForfait = useCallback(async (id: string) => {
    try {
      await forfaitApi.delete(id);
      toast.success("Forfait supprimé");
      setForfaits((prev) => prev.filter((f) => f.id !== id));
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  }, []);

  const toggleForfaitActive = useCallback(async (id: string) => {
    try {
      const { data } = await forfaitApi.toggleActive(id);
      toast.success(data.active ? "Forfait réactivé" : "Forfait désactivé");
      setForfaits((prev) => prev.map((f) => (f.id === id ? data : f)));
      return data;
    } catch {
      toast.error("Erreur lors du changement de statut du forfait");
      throw new Error("toggle-active-failed");
    }
  }, []);

  useEffect(() => {
    fetchForfaits();
  }, [fetchForfaits]);

  return {
    forfaits,
    loading,
    refresh: fetchForfaits,
    createForfait,
    deleteForfait,
    toggleForfaitActive,
  };
};
