import React from 'react';
import { useMesSubscriptions } from '../hooks/useMesSubscriptions';
import { JetonCard } from '../components/JetonCard';
import { Ticket, History, ShieldCheck, RefreshCw, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useTopologyStore } from '@/shared/store/topologyStore';

const JetonsPage: React.FC = () => {
  const { subscriptions, loading, refresh } = useMesSubscriptions();
  const navigate = useNavigate();
  const activeSiteId = useTopologyStore((s) => s.activeSiteId);

  const actifs    = subscriptions.filter(s => s.status === 'PAID' || s.status === 'PENDING');
  const historique = subscriptions.filter(s => s.status === 'CANCELLED' || s.status === 'EXPIRED');

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold tracking-tight">Mes Accès WiFi</h1>
        <Button variant="ghost" size="icon" onClick={refresh} title="Actualiser">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="p-6">
        <Tabs defaultValue="actifs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="actifs" className="gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Actifs
            </TabsTrigger>
            <TabsTrigger value="historique" className="gap-2">
              <History className="h-3.5 w-3.5" />
              Historique
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actifs" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                [1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-52 rounded-xl" />
                ))
              ) : actifs.length > 0 ? (
                actifs.map(s => <JetonCard key={s.id} subscription={s} />)
              ) : (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
                    <Ticket className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Aucune souscription active</p>
                    <p className="text-sm text-muted-foreground">
                      Achetez un forfait pour obtenir un accès WiFi.
                    </p>
                  </div>
                  <Button size="sm" onClick={() => navigate(activeSiteId ? `/acheter/${activeSiteId}` : '/acheter')}>
                    <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                    Acheter un forfait
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="historique" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                [1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-52 rounded-xl" />
                ))
              ) : historique.length > 0 ? (
                historique.map(s => <JetonCard key={s.id} subscription={s} isHistory />)
              ) : (
                <div className="col-span-full py-20 text-center space-y-2">
                  <History className="h-10 w-10 mx-auto text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Votre historique est vide</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default JetonsPage;
