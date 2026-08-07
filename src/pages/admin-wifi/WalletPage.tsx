import type { CSSProperties } from "react";
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, Wallet } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount } from "@/shared/lib/format";
import type { TransactionType } from "@/modules/wallet/types";
import { useWallet } from "@/modules/wallet/hooks/useWallet";
import { WithdrawalDialog } from "@/modules/wallet/components/WithdrawalDialog";
import { KpiCard } from "@/shared/components/KpiCard";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";

const TX_LABEL: Record<TransactionType, string> = {
  CREDIT: "Vente",
  DEBIT:  "Retrait",
};

const TX_TONE: Record<TransactionType, StatusBadgeTone> = {
  CREDIT: "success",
  DEBIT:  "warning",
};

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

      {/* Same recipe as AdminHomePage: content capped at 4xl and centered,
          Card-based KPIs with real gaps instead of a flat divide-x strip,
          "Solde" gets the same white→purple wash as the Home page's card. */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className="relative overflow-hidden bg-white dark:bg-card [background-image:radial-gradient(140%_120%_at_100%_0%,color-mix(in_oklab,var(--accent-purple)_14%,transparent)_0%,transparent_65%)]"
            style={{ "--card-edge-color": "var(--accent-purple)" } as CSSProperties}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Solde disponible</CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-(--accent-purple)/10">
                <Wallet className="h-4 w-4 text-(--accent-purple)" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-32 mt-1" />
              ) : (
                <>
                  <p className="text-[26px] font-semibold tracking-tight">{wallet ? fmt(wallet.balanceAmount) : "—"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Prêt à retirer</p>
                </>
              )}
            </CardContent>
          </Card>

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
                                ? "bg-primary/10"
                                : "bg-amber-500/10"
                            }`}
                          >
                            {isCredit ? (
                              <ArrowUpFromLine className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <ArrowDownToLine className="h-3.5 w-3.5 text-amber-400" />
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
                          <StatusBadge tone={TX_TONE[tx.type]} className="text-[10px]">
                            {TX_LABEL[tx.type]}
                          </StatusBadge>
                          <span
                            className={`font-semibold tabular-nums ${
                              isCredit ? "text-primary" : "text-amber-400"
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
