import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForfaits } from '@/modules/commerce/hooks/useForfaits';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { ForfaitDialog } from '@/modules/commerce/components/ForfaitDialog';


import { DataTable } from '@/shared/components/data-table';
import { getForfaitColumns } from '@/modules/commerce/components/forfaitColumns';
import { Button } from '@/components/ui/button';
import type { Forfait } from '@/modules/commerce/types';

const ForfaitListPage: React.FC = () => {

  const { forfaits, loading, error, refresh, createForfait, toggleForfaitActive } = useForfaits(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isAdminWifi = user?.role === 'ADMIN_WIFI';
  const columns = getForfaitColumns({
    onToggleActive: isAdminWifi ? (id) => toggleForfaitActive(id) : undefined,
  });

  const openForfait = (forfait: Forfait) => navigate(`/forfaits/${forfait.id}`);

  return (
    <div className=" h-full flex flex-col">
      <div className="flex items-center justify-between px-3 lg:px-5 border-b py-3">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Forfaits</h1>
        {user?.role === 'ADMIN_WIFI' ? (
          <ForfaitDialog onCreate={createForfait} />
        ) : (
          <Button className="hover:bg-primary-hover" disabled title="Seuls les administrateurs wifi peuvent créer des forfaits">
            Création
          </Button>
        )}
      </div>

      <DataTable columns={columns} data={forfaits} loading={loading} error={error} onRetry={refresh}
        onRowClick={openForfait} emptyMessage="Aucun forfait n’a encore été créé."
        emptyAction={isAdminWifi ? <ForfaitDialog onCreate={createForfait} /> : undefined}
        filters={[{ columnId: "active", label: "Statut", options: [{ label: "Actif", value: true }, { label: "Inactif", value: false }] }]}
      />
    </div>
  );
};

export default ForfaitListPage;
