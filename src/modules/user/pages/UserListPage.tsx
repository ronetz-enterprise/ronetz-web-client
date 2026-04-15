import React from 'react';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { UserPlus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UserListPage: React.FC = () => {
  const { users, loading, deleteUser } = useUsers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Gestion Utilisateurs</h1>
        
      </div>

      <div className="px-5">
        <UserTable users={users} loading={loading} onDelete={deleteUser} />
      </div>
    </div>
  );
};

export default UserListPage;
