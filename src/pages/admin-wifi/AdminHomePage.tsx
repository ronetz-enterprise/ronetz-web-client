import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Users, ArrowUpFromLine, ArrowDownToLine, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWallet } from '@/modules/wallet/hooks/useWallet';
import { useDashboardStats } from '@/modules/commerce/hooks/useDashboardStats';
import type { TransactionType } from '@/modules/wallet/types';
import { KpiCard } from '@/shared/components/KpiCard';
import { StatusBadge, type StatusBadgeTone } from '@/shared/components/StatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatAmount } from '@/shared/lib/format';

const TX_LABEL: Record<TransactionType, string> = {
  CREDIT: "Vente",
  DEBIT: "Retrait",
};

const TX_TONE: Record<TransactionType, StatusBadgeTone> = {
  CREDIT: "success",
  DEBIT: "warning",
};

// ADMIN_WIFI landing page: solde, utilisateurs actifs, dernières transactions
// et événements récents — "événements" est ici les derniers achats de
// forfaits (stats.recentSales), le seul flux d'activité déjà exposé côté
// ADMIN_WIFI (les logs système sous /admin/logs sont réservés SUPER_ADMIN).
const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { wallet, transactions, loading: walletLoading } = useWallet();
  const { stats, loading: statsLoading } = useDashboardStats();

  const currency = wallet?.balanceCurrency ?? stats?.recentSales[0]?.currency ?? "XAF";
  const fmt = (n: number) => {
    try { return formatAmount(n, currency); }
    catch { return `${n.toLocaleString("fr-FR")} ${currency}`; }
  };

  const recentTransactions = transactions.slice(0, 5);
  const recentEvents = stats?.recentSales.slice(0, 5) ?? [];

  return (
    <div className="space-y-0">
      <div className="px-6 py-4 border-b">
        <h1 className="text-xl font-semibold tracking-tight">Accueil</h1>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Predominantly-white card with a soft white→purple wash in the
              corner — a light touch (a background wash + a matching tint on
              the card's own bottom edge accent, see --card-edge-color in
              components/ui/card.tsx) rather than a loud filled gradient. */}
          <Card
            className="relative overflow-hidden bg-white dark:bg-card [background-image:radial-gradient(140%_120%_at_100%_0%,color-mix(in_oklab,var(--accent-purple)_14%,transparent)_0%,transparent_65%)]"
            style={{ "--card-edge-color": "var(--accent-purple)" } as React.CSSProperties}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Solde</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--accent-purple)/10">
                <Wallet className="h-4 w-4 text-(--accent-purple)" />
              </div>
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <Skeleton className="h-8 w-32 mt-1" />
              ) : (
                <>
                  <p className="text-[26px] font-semibold tracking-tight">{fmt(wallet?.balanceAmount ?? 0)}</p>
                  <button
                    onClick={() => navigate('/wallet')}
                    className="text-xs text-muted-foreground hover:text-foreground mt-1"
                  >
                    Voir le portefeuille →
                  </button>
                </>
              )}
            </CardContent>
          </Card>

          <KpiCard
            title="Utilisateurs actifs"
            value={statsLoading || !stats ? "—" : `${stats.activeSubscriptions}`}
            subtitle="Abonnements en cours"
            icon={Users}
            loading={statsLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Dernières transactions</CardTitle>
                <CardDescription className="text-xs">Entrées et sorties du portefeuille</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/wallet')}>
                Voir tout <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {walletLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-10 rounded-md" />)}
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Aucune transaction pour l'instant
                </div>
              ) : (
                <div className="divide-y">
                  {recentTransactions.map((tx) => {
                    const isCredit = tx.type === "CREDIT";
                    const date = new Date(tx.createdAt);
                    return (
                      <div key={tx.id} className="flex items-center justify-between px-6 py-3 text-sm hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${isCredit ? "bg-primary/10" : "bg-amber-500/10"}`}>
                            {isCredit ? (
                              <ArrowUpFromLine className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <ArrowDownToLine className="h-3.5 w-3.5 text-amber-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium leading-none">{tx.description}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge tone={TX_TONE[tx.type]} className="text-[10px]">{TX_LABEL[tx.type]}</StatusBadge>
                          <span className={`font-semibold tabular-nums ${isCredit ? "text-primary" : "text-amber-400"}`}>
                            {isCredit ? "+" : "−"}{fmt(tx.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Événements récents</CardTitle>
                <CardDescription className="text-xs">Derniers achats de forfaits</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/stats')}>
                Voir tout <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {statsLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-10 rounded-md" />)}
                </div>
              ) : recentEvents.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Aucun événement sur les 30 derniers jours
                </div>
              ) : (
                <div className="divide-y">
                  {recentEvents.map((sale, i) => {
                    const date = new Date(sale.paidAt);
                    return (
                      <div key={i} className="flex items-center justify-between px-6 py-3 text-sm hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                            <ShoppingBag className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium leading-none">{sale.productName}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold tabular-nums">{fmt(sale.amount)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
