import React from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { useAuthStore } from '@/shared/store/authStore';

const UserListPage: React.FC = () => {
  const { user } = useAuthStore();
  const { users, loading, deleteUser, toggleUserStatus, grantAdminWifi } = useUsers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Gestion Utilisateurs</h1>
        
      </div>

      <div className="">
        <UserTable
          users={users}
          loading={loading}
          currentUserId={user?.id ?? ''}
          onDelete={deleteUser}
          onToggleStatus={toggleUserStatus}
          onGrantAdminWifi={grantAdminWifi}
        />
      </div>
    </div>
  );
};

export default UserListPage;
