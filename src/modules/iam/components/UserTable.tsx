import React from 'react';
import type { UserDetails } from '../types';
import { DataTable } from '@/shared/components/data-table';
import { getUsersColumns, type UserTableActions } from './usersColumns';

interface UserTableProps {
  users: UserDetails[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  currentUserId: string;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onGrantAdminWifi: (id: string, organizationName: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading, error, onRetry,
  currentUserId,
  onDelete,
  onToggleStatus,
  onGrantAdminWifi,
}) => {
  const columns = React.useMemo(() => {
    const actions: UserTableActions = {
      currentUserId,
      onDelete,
      onToggleStatus,
      onGrantAdminWifi,
    };
    return getUsersColumns(actions);
  }, [currentUserId, onDelete, onToggleStatus, onGrantAdminWifi]);

  return (
    <DataTable columns={columns} data={users} loading={loading} error={error} onRetry={onRetry} emptyMessage="Aucun utilisateur." filters={[{ columnId: "active", label: "Statut", options: [{ label: "Actif", value: true }, { label: "Bloqué", value: false }] }]} />
  );
};
