import React from 'react';
import { useMesSubscriptions } from '@/modules/commerce/hooks/useMesSubscriptions';
import { useMyTokens } from '@/modules/access-sessions/hooks/useMyTokens';
import { TokenCredentialCard } from '@/modules/access-sessions/components/TokenCredentialCard';
import { JetonCard } from '@/modules/access-sessions/components/JetonCard';
import { Wifi, ShoppingBag, RefreshCw, Clock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useTopologyStore } from '@/modules/network-ops/store/topologyStore';
import { useAuthStore } from '@/modules/auth/store/authStore';

const HomePage: React.FC = () => {
  const { subscriptions, loading: subLoading, refresh: refreshSubs } = useMesSubscriptions();
  const { tokens, loading: tokLoading, refresh: refreshTokens, revoke: revokeToken } = useMyTokens();
  const navigate = useNavigate();
  const activeSiteId = useTopologyStore((s) => s.activeSiteId);
  const { user } = useAuthStore();

  const loading = subLoading || tokLoading;
  const refresh = () => { refreshSubs(); refreshTokens(); };

  const activeTokens = tokens.filter(t => t.status === 'ACTIVE');
  const pending  = subscriptions.filter(s => s.status === 'PENDING');

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const buyUrl = activeSiteId ? `/acheter/${activeSiteId}` : '/acheter';

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {greeting()}{user?.firstName ? `, ${user.firstName}` : ''} 👋
          </h1>
         
        </div>
        <Button variant="ghost" size="icon" onClick={refresh} title="Actualiser">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="p-6 space-y-8">
        {/* Active tokens with credentials */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              Mes identifiants WiFi
            </h2>
            <Button variant="default" size="sm" onClick={() => navigate(buyUrl)}>
              <ShoppingBag className="mr-2 h-3.5 w-3.5" />
              Acheter un forfait
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {[1, 2].map(i => <Skeleton key={i} className="h-36 rounded-lg" />)}
            </div>
          ) : activeTokens.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {activeTokens.map(t => <TokenCredentialCard key={t.id} token={t} onRevoke={revokeToken} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed p-12 text-center space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
                <Wifi className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Aucun accès WiFi actif</p>
                <p className="text-sm text-muted-foreground">
                  Achetez un forfait pour obtenir vos identifiants de connexion.
                </p>
              </div>
              <Button size="sm" onClick={() => navigate(buyUrl)}>
                <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                Voir les forfaits
              </Button>
            </div>
          )}
        </section>

        {/* Pending payments */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-(--accent-yellow)" />
              En attente de confirmation ({pending.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pending.map(s => <JetonCard key={s.id} subscription={s} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default HomePage;
