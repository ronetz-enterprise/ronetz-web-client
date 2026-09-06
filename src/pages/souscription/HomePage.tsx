import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMesSubscriptions } from '@/modules/commerce/hooks/useMesSubscriptions';
import { useForfaits } from '@/modules/commerce/hooks/useForfaits';
import { useMyTokens } from '@/modules/access-sessions/hooks/useMyTokens';
import { TokenCredentialCard } from '@/modules/access-sessions/components/TokenCredentialCard';
import { TransactionRow } from '@/modules/commerce/components/TransactionRow';
import { Wifi, ShoppingBag, Receipt, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useTopologyStore } from '@/modules/network-ops/store/topologyStore';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { Card } from '@/components/ui/card';

// Accueil : grand message seul à gauche ; à droite, "Mes accès"
// (TokenCredentialCard empilées, "Voir plus" pour déplier) puis les
// dernières transactions, empilés. Le tout centré à l'écran.
const ACCES_PREVIEW_COUNT = 4;
const TRANSACTIONS_PREVIEW_COUNT = 4;

const HomePage: React.FC = () => {
  const { subscriptions, loading: subLoading } = useMesSubscriptions();
  const { tokens, loading: tokLoading } = useMyTokens();
  const { forfaits } = useForfaits(null);
  const navigate = useNavigate();
  const activeSiteId = useTopologyStore((s) => s.activeSiteId);
  const { user } = useAuthStore();
  const [accesExpanded, setAccesExpanded] = useState(false);

  const loading = subLoading || tokLoading;
  // SubscriptionDto only has a productId — resolve it against the forfaits
  // catalog so TransactionRow can show "Achat du forfait <nom>" instead of a
  // raw reference. Falls back to a generic label for deactivated products
  // (forfaitApi.getAll only returns active ones) or while still loading.
  const forfaitNameById = useMemo(
    () => Object.fromEntries(forfaits.map((f) => [f.id, f.name])),
    [forfaits]
  );

  const activeTokens = tokens.filter((t) => t.status === 'ACTIVE');
  const accesVisible = accesExpanded ? activeTokens : activeTokens.slice(0, ACCES_PREVIEW_COUNT);
  const accesHiddenCount = activeTokens.length - accesVisible.length;

  // En attente d'abord — c'est l'état qui appelle le plus une action/attention de l'utilisateur.
  const transactionsPreview = [...subscriptions]
    .sort((a, b) => (a.status === 'PENDING' ? -1 : 0) - (b.status === 'PENDING' ? -1 : 0))
    .slice(0, TRANSACTIONS_PREVIEW_COUNT);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const buyUrl = activeSiteId ? `/acheter/${activeSiteId}` : '/acheter';

  return (
    <div className="relative min-h-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/6 via-primary/2 to-transparent px-4 py-10 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-(--accent-blue)/5 blur-3xl"
      />

      <div className="relative max-w-4xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10">
          {/* Grand message — seul à gauche */}
          <div className="flex flex-col items-start text-left gap-4">
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight ">
              <span className="bg-gradient-to-r from-primary to-(--accent-blue) bg-clip-text text-transparent">
                {greeting()}{user?.firstName ? ` ${user.firstName}` : ''}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">Bienvenue sur Ronetz</p>
          </div>

          {/* Tout le reste — accès (avec recherche) puis transactions, empilés à droite */}
          <div className="flex flex-col gap-8 min-w-0">
            {/* Mes accès */}
            <section className="flex flex-col min-w-0">
              <h2 className="text-sm font-medium text-muted-foreground mb-3">Mes accès</h2>

              {loading ? (
                <div className="grid grid-cols-1 gap-3">
                  {[1, 2].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
                </div>
              ) : activeTokens.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-card/60 p-8 text-center space-y-4">
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
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    {accesVisible.map(t => <TokenCredentialCard key={t.id} token={t} />)}
                  </div>
                  {accesHiddenCount > 0 && (
                    <div className="flex justify-center">
                      <Button variant="ghost" size="sm" onClick={() => setAccesExpanded(true)}>
                        Voir plus ({accesHiddenCount})
                        <ChevronDown className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Transactions */}
            <section className="flex flex-col min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                  Transactions
                </h2>
                {subscriptions.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={() => navigate('/souscriptions')}>
                    Voir tout
                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="rounded-lg border divide-y overflow-hidden">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 m-3 rounded-md" />)}
                </div>
              ) : transactionsPreview.length > 0 ? (
                <Card className="gap-0 p-0 divide-y divide-border overflow-hidden">
                  {transactionsPreview.map(s => (
                    <TransactionRow
                      key={s.id}
                      transaction={s}
                      productName={forfaitNameById[s.productId]}
                      onClick={() => navigate(`/souscriptions/${s.id}`)}
                    />
                  ))}
                </Card>
              ) : (
                <div className="rounded-xl border border-dashed bg-card/60 p-8 text-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Aucune transaction</p>
                    <p className="text-sm text-muted-foreground">Achetez un forfait pour démarrer.</p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
