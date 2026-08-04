import React from 'react';
import { useForfaits } from '@/modules/commerce/hooks/useForfaits';
import { Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { InternetPlanCard } from '@/modules/commerce/components/InternetPlanCard';

const ForfaitsAchatPage: React.FC = () => {
  const { siteId } = useParams();
  const { forfaits, loading } = useForfaits(siteId ?? null);
  const navigate = useNavigate();

  return (
    <div>
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-semibold tracking-tight">Achat de forfait</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Choisissez le forfait adapté à vos besoins</p>
      </div>

      <div className="p-6">
        {siteId ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {loading ? (
              [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)
            ) : forfaits.length > 0 ? (
              forfaits.map(f => (
                <InternetPlanCard
                  key={f.id}
                  forfait={f}
                  onSelect={(product) => navigate('/paiement', { state: { product, siteId } })}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
                  <Info className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Aucun forfait disponible pour ce site.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
              <Info className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Aucun site spécifié.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForfaitsAchatPage;
