import { useState, useEffect, useCallback } from 'react';
import { userApi } from '@/core/api/endpoints/userApi';
import type { UserDetails } from '@/shared/types';
import { toast } from 'sonner';

export const useUsers = () => {
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const  data  = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = async (id: string) => {
    try {
      await userApi.delete(id);
      toast.success('Utilisateur supprimé');
      fetchUsers();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      await userApi.toggleStatus(id);
      toast.success('Statut du compte mis à jour');
      fetchUsers();
    } catch {
      toast.error('Impossible de modifier le statut');
    }
  };

  const grantAdminWifi = async (id: string, tenantName: string) => {
    try {
      await userApi.grantToAdminWifi(id, tenantName);
      toast.success('Utilisateur promu ADMIN_WIFI');
      fetchUsers();
    } catch {
      toast.error('Impossible de modifier le rôle');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    refresh: fetchUsers,
    deleteUser,
    toggleUserStatus,
    grantAdminWifi,
  };
};
