import React from 'react';
import type { UserDetails } from '@/shared/types';
import { DataTable } from '@/shared/components/data-table';
import { getUsersColumns, type UserTableActions } from './usersColumns';

interface UserTableProps {
  users: UserDetails[];
  loading: boolean;
  currentUserId: string;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onGrantAdminWifi: (id: string, tenantName: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  currentUserId,
  onDelete,
  onToggleStatus,
  onGrantAdminWifi,
}) => {
  // If loading is true we could optionally return a skeleton here,
  // but DataTable could also handle it, or we simply return DataTable with empty data or handle inside DataTable component.
  // We'll mimic the RouteurPage loading strategy where UserListPage handles skeletons.
  // Wait, UserListPage passes `loading` down, and UserTable handled it inside <tbody>.
  // We will keep the <tbody> skeleton approach inside DataTable ? DataTable does not know about loading.
  // Since UserListPage passes loading, I'll just return a standard skeleton if loading is true.
  
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

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
    <DataTable columns={columns} data={users} />
  );
};
