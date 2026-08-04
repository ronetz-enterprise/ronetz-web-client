import React from 'react';
import { useMesSubscriptions } from '@/modules/commerce/hooks/useMesSubscriptions';
import type { SubscriptionDto, SubscriptionStatus } from '@/modules/commerce/types';
import { formatAmount } from '@/shared/lib/format';
import {
  Ticket,
  RefreshCw,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useTopologyStore } from '@/modules/network-ops/store/topologyStore';

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  PENDING: {
    label: 'En attente',
    icon: <Clock className="h-3 w-3" />,
    variant: 'outline',
  },
  PAID: {
    label: 'Payé',
    icon: <CheckCircle2 className="h-3 w-3" />,
    variant: 'default',
  },
  CANCELLED: {
    label: 'Annulé',
    icon: <Ban className="h-3 w-3" />,
    variant: 'secondary',
  },
  EXPIRED: {
    label: 'Expiré',
    icon: <XCircle className="h-3 w-3" />,
    variant: 'destructive',
  },
};

interface RowProps {
  sub: SubscriptionDto;
  onCancel: (id: string) => void;
}

const SubscriptionRow: React.FC<RowProps> = ({ sub, onCancel }) => {
  const sc = statusConfig[sub.status];
  const canCancel = sub.status === 'PENDING';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border bg-card p-4 hover:bg-accent/30 transition-colors">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted">
        <Ticket className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={sc.variant} className="gap-1">
            {sc.icon}
            {sc.label}
          </Badge>
          {sub.tokenId && (
            <Badge variant="outline" className="gap-1 text-primary border-primary/30 bg-primary/5">
              <CheckCircle2 className="h-3 w-3" />
              Token émis
            </Badge>
          )}
        </div>
        <p className="text-xs font-mono text-muted-foreground truncate" title={sub.id}>
          {sub.id}
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">{formatAmount(sub.amount, sub.currency)}</span>
          {sub.paidAt && (
            <span className="text-muted-foreground text-xs">
              {new Date(sub.paidAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>

      {canCancel && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (window.confirm('Annuler cette souscription ?')) {
              onCancel(sub.id);
            }
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
        >
          <XCircle className="mr-1.5 h-3.5 w-3.5" />
          Annuler
        </Button>
      )}
    </div>
  );
};

const MesSouscriptionsPage: React.FC = () => {
  const { subscriptions, loading, refresh, cancel } = useMesSubscriptions();
  const navigate = useNavigate();
  const activeSiteId = useTopologyStore((s) => s.activeSiteId);

  const active = subscriptions.filter((s) => s.status === 'PENDING' || s.status === 'PAID');
  const history = subscriptions.filter((s) => s.status === 'CANCELLED' || s.status === 'EXPIRED');

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold tracking-tight">Mes Souscriptions</h1>
        <Button variant="ghost" size="icon" onClick={refresh} title="Actualiser">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="p-6 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            En cours ({active.length})
          </h2>

          {loading ? (
            [1, 2].map((i) => <Skeleton key={i} className="h-20 rounded-lg" />)
          ) : active.length > 0 ? (
            active.map((s) => (
              <SubscriptionRow key={s.id} sub={s} onCancel={cancel} />
            ))
          ) : (
            <div className="py-12 text-center rounded-lg border border-dashed space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
                <Ticket className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Aucune souscription active</p>
                <p className="text-sm text-muted-foreground">Achetez un forfait pour démarrer.</p>
              </div>
              <Button onClick={() => navigate(activeSiteId ? `/acheter/${activeSiteId}` : '/acheter')} size="sm">
                <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                Acheter un forfait
              </Button>
            </div>
          )}
        </section>

        {!loading && history.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Historique ({history.length})
            </h2>
            {history.map((s) => (
              <SubscriptionRow key={s.id} sub={s} onCancel={cancel} />
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default MesSouscriptionsPage;
