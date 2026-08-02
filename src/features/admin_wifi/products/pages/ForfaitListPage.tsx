import React from 'react';
import { useForfaits } from '../hooks/useForfaits';
import { useAuthStore } from '@/shared/store/authStore';
import { ForfaitDialog } from '../components/ForfaitDialog';

import { PackagePlus } from 'lucide-react';
import { InternetPlanCard } from '../components/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';

const ForfaitListPage: React.FC = () => {

  const { forfaits, loading, createForfait } = useForfaits(null);
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 h-full flex flex-col">
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
      <div className='flex-1 px-3 lg:px-5'>
        {loading ? (
          <div className=" gap-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
            [&>*]:border-t

            sm:[&>*:not(:nth-child(2n))]:border-r
            sm:[&>*:nth-last-child(-n+2)]:border-b-0
            sm:[&>*:nth-child(-n+2)]:border-t
            lg:[&>*:not(:nth-child(4n))]:border-r
            lg:[&>*:nth-last-child(-n+4)]:border-b
            lg:[&>*:nth-child(-n+4)]:border-t">
            {[1, 2, 3,4,5,6,7,8,].map(i => <Skeleton key={i} className=" h-24 rounded-none " />)}

          </div>

        ) : <div className="  grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 

              [&>*]:border-b
              sm:[&>*:not(:nth-child(2n))]:border-r
              sm:[&>*:nth-last-child(-n+2)]:border-b-0
              sm:[&>*:nth-child(-n+2)]:border-t
              lg:[&>*:not(:nth-child(4n))]:border-r
              lg:[&>*:nth-last-child(-n+4)]:border-b
              lg:[&>*:nth-child(-n+4)]:border-t">
          {(forfaits.length > 0) ? (forfaits.map(f => (
            <InternetPlanCard

              forfait={f}


            />
          ))) :
            <div className="col-span-full flex flex-col items-center justify-center text-center
                rounded-lg border border-dashed border-border p-10 space-y-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-border">
                <PackagePlus className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-base font-semibold text-foreground">
                Aucun forfait interne disponible
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Commencez par créer vos premiers forfaits pour les rendre disponibles à vos utilisateurs.
              </p>
              <Button className="mt-2" disabled title="Utilisez le bouton Créer un forfait ci-dessus">
                Créez un forfait depuis le bouton ci-dessus
              </Button>

            </div>}

        </div>
        }
      </div>
    </div>
  );
};

export default ForfaitListPage;
