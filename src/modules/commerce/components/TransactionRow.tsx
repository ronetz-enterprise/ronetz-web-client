import React from "react";
import { ChevronRight, KeyRound, CheckCircle2, Clock, XCircle, AlertCircle, type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SubscriptionDto, SubscriptionStatus } from "../types";
import { formatAmount } from "@/shared/lib/format";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";

// Une ligne dans la "list card" des transactions (voir HomePage / SouscriptionsListPage) —
// plusieurs lignes empilées (divide-y) dans un unique conteneur bordé, à la différence du
// JetonCard (une grande card visuelle par élément, gardée pour le hero de
// SouscriptionDetailPage).

const statusConfig: Record<
  SubscriptionStatus,
  { label: string; tone: StatusBadgeTone; icon: LucideIcon; iconBg: string; iconColor: string }
> = {
  PENDING:   { label: "En attente", tone: "warning", icon: Clock,        iconBg: "bg-(--accent-yellow)/15", iconColor: "text-(--accent-yellow)" },
  PAID:      { label: "Payé",       tone: "success", icon: CheckCircle2, iconBg: "bg-primary/10",           iconColor: "text-primary" },
  CANCELLED: { label: "Annulé",     tone: "neutral", icon: XCircle,      iconBg: "bg-muted",                iconColor: "text-muted-foreground" },
  EXPIRED:   { label: "Expiré",     tone: "danger",  icon: AlertCircle,  iconBg: "bg-destructive/10",       iconColor: "text-destructive" },
};

interface TransactionRowProps {
  transaction: SubscriptionDto;
  /**
   * SubscriptionDto only carries productId, not a name — the caller resolves
   * it (e.g. against the forfaits list) and passes it down. Falls back to a
   * generic label when unresolved (still loading, or the product is no
   * longer active and dropped out of the catalog).
   */
  productName?: string;
  onClick: () => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ transaction, productName, onClick }) => {
  const sc = statusConfig[transaction.status];
  const Icon = sc.icon;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-accent/40 transition-colors"
    >
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", sc.iconBg)}>
        <Icon className={cn("size-4", sc.iconColor)} />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium truncate">
          {productName ? `Achat du forfait ${productName}` : "Achat de forfait"}
        </p>
        <div className="flex items-center gap-2">
          <StatusBadge tone={sc.tone} className="text-[11px]">{sc.label}</StatusBadge>
          {transaction.tokenId && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <KeyRound className="h-2.5 w-2.5" />
              Accès émis
            </span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-semibold tabular-nums">{formatAmount(transaction.amount, transaction.currency)}</p>
        {transaction.paidAt && (
          <p className="text-[11px] text-muted-foreground">
            {new Date(transaction.paidAt).toLocaleDateString("fr-FR")}
          </p>
        )}
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
};
