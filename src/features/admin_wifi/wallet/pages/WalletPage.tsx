import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount, type TransactionType } from "@/shared/types";
import { useWallet } from "../hooks/useWallet";
import { WithdrawalDialog } from "../components/WithdrawalDialog";

const TX_LABEL: Record<TransactionType, string> = {
  CREDIT: "Vente",
  DEBIT:  "Retrait",
};

const TX_BADGE: Record<TransactionType, string> = {
  CREDIT: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  DEBIT:  "bg-orange-500/10  text-orange-600  border-orange-500/20",
};

function KpiCard({
  title, value, subtitle, icon: Icon, loading,
}: {
  title: string; value: string; subtitle?: string;
  icon: React.ElementType; loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-32 mt-1" />
        ) : (
          <>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function WalletPage() {
  const { wallet, transactions, loading, withdrawing, refresh, requestWithdrawal } = useWallet();

  const currency = wallet?.balanceCurrency ?? "XAF";
  const fmt = (n: number) => {
    try { return formatAmount(n, currency); }
    catch { return `${n.toLocaleString("fr-FR")} ${currency}`; }
  };

  const credits = transactions.filter((t) => t.type === "CREDIT");
  const debits  = transactions.filter((t) => t.type === "DEBIT");
  const totalIn  = credits.reduce((s, t) => s + t.amount, 0);
  const totalOut = debits.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Mon Portefeuille</h1>
          <p className="text-sm text-muted-foreground">
            Suivi de vos revenus et demandes de retrait
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={refresh} title="Actualiser">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {wallet && (
            <WithdrawalDialog
              wallet={wallet}
              onWithdraw={requestWithdrawal}
              loading={withdrawing}
            />
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            title="Solde disponible"
            value={wallet ? fmt(wallet.balanceAmount) : "—"}
            subtitle="Prêt à retirer"
            icon={Wallet}
            loading={loading}
          />
          <KpiCard
            title="Total encaissé"
            value={totalIn > 0 ? fmt(totalIn) : "—"}
            subtitle={`${credits.length} vente${credits.length > 1 ? "s" : ""}`}
            icon={ArrowUpFromLine}
            loading={loading}
          />
          <KpiCard
            title="Total retiré"
            value={totalOut > 0 ? fmt(totalOut) : "—"}
            subtitle={`${debits.length} retrait${debits.length > 1 ? "s" : ""}`}
            icon={ArrowDownToLine}
            loading={loading}
          />
        </div>

        {/* No wallet yet */}
        {!loading && !wallet && (
          <div className="py-20 text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
              <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Votre portefeuille sera créé automatiquement à la première vente.
            </p>
          </div>
        )}

        {/* Transaction history */}
        {(loading || transactions.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Historique des transactions</CardTitle>
              <CardDescription className="text-xs">
                Toutes vos entrées et sorties de fonds
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} className="h-12 rounded-md" />
                  ))}
                </div>
              ) : transactions.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  Aucune transaction pour l'instant
                </div>
              ) : (
                <div className="divide-y">
                  {transactions.map((tx) => {
                    const date = new Date(tx.createdAt);
                    const isCredit = tx.type === "CREDIT";
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between px-6 py-3 text-sm hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                              isCredit
                                ? "bg-emerald-500/10"
                                : "bg-orange-500/10"
                            }`}
                          >
                            {isCredit ? (
                              <ArrowUpFromLine className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <ArrowDownToLine className="h-3.5 w-3.5 text-orange-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium leading-none">{tx.description}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {date.toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${TX_BADGE[tx.type]}`}
                          >
                            {TX_LABEL[tx.type]}
                          </Badge>
                          <span
                            className={`font-semibold tabular-nums ${
                              isCredit ? "text-emerald-600" : "text-orange-600"
                            }`}
                          >
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
        )}
      </div>
    </div>
  );
}
