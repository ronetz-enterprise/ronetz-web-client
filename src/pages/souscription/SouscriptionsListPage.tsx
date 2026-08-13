import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMesSubscriptions } from "@/modules/commerce/hooks/useMesSubscriptions";
import { useForfaits } from "@/modules/commerce/hooks/useForfaits";
import { TransactionRow } from "@/modules/commerce/components/TransactionRow";
import { ArrowLeft, RefreshCw, ShoppingBag, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopologyStore } from "@/modules/network-ops/store/topologyStore";

// Liste complète des transactions, en list card (lignes empilées, voir TransactionRow) —
// le détail de chacune (et l'action Annuler) vit sur sa propre page dédiée,
// /souscriptions/:id (SouscriptionDetailPage). Atteinte depuis HomePage via "Voir tout".
const SouscriptionsListPage: React.FC = () => {
  const { subscriptions, loading, refresh } = useMesSubscriptions();
  const { forfaits } = useForfaits(null);
  const navigate = useNavigate();
  const activeSiteId = useTopologyStore((s) => s.activeSiteId);

  // See HomePage.tsx for why this lookup exists: SubscriptionDto only has a
  // productId, TransactionRow needs the forfait's name.
  const forfaitNameById = useMemo(
    () => Object.fromEntries(forfaits.map((f) => [f.id, f.name])),
    [forfaits]
  );

  const active = subscriptions.filter((s) => s.status === "PENDING" || s.status === "PAID");
  const history = subscriptions.filter((s) => s.status === "CANCELLED" || s.status === "EXPIRED");

  return (
    <div>
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold tracking-tight flex-1">Transactions</h1>
        <Button variant="ghost" size="icon" onClick={refresh} title="Actualiser">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="p-6 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            En cours ({active.length})
          </h2>

          {loading ? (
            <div className="rounded-lg border divide-y overflow-hidden">
              {[1, 2].map((i) => <Skeleton key={i} className="h-16 m-3 rounded-md" />)}
            </div>
          ) : active.length > 0 ? (
            <div className="rounded-lg border divide-y overflow-hidden">
              {active.map((s) => (
                <TransactionRow
                  key={s.id}
                  transaction={s}
                  productName={forfaitNameById[s.productId]}
                  onClick={() => navigate(`/souscriptions/${s.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center rounded-lg border border-dashed space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
                <Receipt className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Aucune transaction en cours</p>
                <p className="text-sm text-muted-foreground">Achetez un forfait pour démarrer.</p>
              </div>
              <Button onClick={() => navigate(activeSiteId ? `/acheter/${activeSiteId}` : "/acheter")} size="sm">
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
            <div className="rounded-lg border divide-y overflow-hidden">
              {history.map((s) => (
                <TransactionRow
                  key={s.id}
                  transaction={s}
                  productName={forfaitNameById[s.productId]}
                  onClick={() => navigate(`/souscriptions/${s.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SouscriptionsListPage;
