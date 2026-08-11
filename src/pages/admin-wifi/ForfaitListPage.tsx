import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForfaits } from '@/modules/commerce/hooks/useForfaits';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { ForfaitDialog } from '@/modules/commerce/components/ForfaitDialog';

import { PackagePlus } from 'lucide-react';
import { DataTable } from '@/shared/components/data-table';
import { getForfaitColumns } from '@/modules/commerce/components/forfaitColumns';
import { Button } from '@/components/ui/button';
import type { Forfait } from '@/modules/commerce/types';

const ForfaitListPage: React.FC = () => {

  const { forfaits, loading, createForfait, toggleForfaitActive } = useForfaits(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [statusTab] = useState<'active' | 'inactive'>('active');
  const isAdminWifi = user?.role === 'ADMIN_WIFI';

  const visibleForfaits = forfaits.filter((f) => (statusTab === 'active' ? f.active : !f.active));
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

      <div className='flex-1 min-h-0'>
          <div className="h-full overflow-y-auto px-3 lg:px-5 py-6">
            {(loading || visibleForfaits.length > 0) ? (
              <div>
                

                <DataTable
                  columns={columns}
                  data={visibleForfaits}
                  loading={loading}
                  enableSorting
                  enableGlobalFilter
                  globalFilterPlaceholder="Rechercher un forfait..."
                  enablePagination
                  pageSize={10}
                  onRowClick={openForfait}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center
                border border-dashed border-border p-10 space-y-4 m-3">
                <div className="flex h-11 w-11 items-center justify-center border border-border">
                  <PackagePlus className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-base font-semibold text-foreground">
                  {statusTab === 'active' ? 'Aucun forfait actif' : 'Aucun forfait inactif'}
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {statusTab === 'active'
                    ? 'Commencez par créer vos premiers forfaits pour les rendre disponibles à vos utilisateurs.'
                    : 'Les forfaits désactivés apparaîtront ici.'}
                </p>
                {statusTab === 'active' && (
                  <Button className="mt-2" disabled title="Utilisez le bouton Créer un forfait ci-dessus">
                    Créez un forfait depuis le bouton ci-dessus
                  </Button>
                )}
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default ForfaitListPage;
