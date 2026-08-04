import React, { useState } from 'react';
import { useForfaits } from '@/modules/commerce/hooks/useForfaits';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { ForfaitDialog } from '@/modules/commerce/components/ForfaitDialog';

import { PackagePlus, ChevronLeft } from 'lucide-react';
import { InternetPlanCard } from '@/modules/commerce/components/InternetPlanCard';
import { ForfaitDetail } from '@/modules/commerce/components/ForfaitDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/shared/lib/utils';
import type { Forfait } from '@/modules/commerce/types';

const ForfaitListPage: React.FC = () => {

  const { forfaits, loading, createForfait, toggleForfaitActive } = useForfaits(null);
  const { user } = useAuthStore();
  const [selectedForfait, setSelectedForfait] = useState<Forfait | null>(null);
  const [statusTab, setStatusTab] = useState<'active' | 'inactive'>('active');

  const visibleForfaits = forfaits.filter((f) => (statusTab === 'active' ? f.active : !f.active));

  const handleTabChange = (value: string) => {
    setStatusTab(value as 'active' | 'inactive');
    setSelectedForfait(null);
  };

  const toRows = <T,>(items: T[]): T[][] => {
    const rows: T[][] = [];
    for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
    return rows;
  };

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
        {loading ? (
          <div className="border-t border-r border-b divide-y divide-border">
            {toRows([1, 2, 3, 4, 5, 6, 7, 8]).map((row, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                {row.map(n => <Skeleton key={n} className="h-20 rounded-none" />)}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-[65%_35%]  h-full">
            <div className={cn("h-full overflow-y-auto lg:border-r px-3 lg:px-5 py-6", selectedForfait && "hidden lg:block")}>
              {(visibleForfaits.length > 0) ? (
                <div className=" ">
                  <div className="pb-8">
                    <Tabs value={statusTab} onValueChange={handleTabChange}>
                      <TabsList variant="line">
                        <TabsTrigger value="active">Actifs</TabsTrigger>
                        <TabsTrigger value="inactive">Inactifs</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                    <div  className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 ">

                       {visibleForfaits.map((f) => (
                      
                        <InternetPlanCard
                          key={f.id}
                          forfait={f}
                          selected={selectedForfait?.id === f.id}
                          onSelect={setSelectedForfait}
                          alwaysInteractive
        
                        />
                      
                  ))}
                      
</div>

                 
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

            <div className={cn("h-full bg-sidebar", !selectedForfait && "hidden lg:block")}>
              {selectedForfait && (
                <button
                  onClick={() => setSelectedForfait(null)}
                  className="flex lg:hidden items-center gap-1 px-4 pt-4 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Retour
                </button>
              )}
              <ForfaitDetail
                forfait={selectedForfait}
                onToggleActive={user?.role === 'ADMIN_WIFI' ? toggleForfaitActive : undefined}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForfaitListPage;
