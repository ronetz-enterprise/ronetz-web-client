import React from "react";
import { Clock, Copy, Wifi, CheckCircle2, AlertCircle, Ban, XCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SubscriptionDto, SubscriptionStatus } from "@/modules/commerce/types";
import { formatAmount } from "@/shared/lib/format";
import { toast } from "sonner";

interface JetonCardProps {
  subscription: SubscriptionDto;
  isHistory?: boolean;
  /** Rend la card cliquable (voir SouscriptionsListPage/HomePage → page de description dédiée). */
  onClick?: () => void;
}

const statusTone: Record<SubscriptionStatus, string> = {
  PAID:      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  PENDING:   "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  CANCELLED: "bg-muted text-muted-foreground",
  EXPIRED:   "bg-muted text-muted-foreground",
};

const statusIcon: Record<SubscriptionStatus, React.ReactNode> = {
  PAID:      <CheckCircle2 className="h-2.5 w-2.5" />,
  PENDING:   <AlertCircle className="h-2.5 w-2.5" />,
  CANCELLED: <Ban className="h-2.5 w-2.5" />,
  EXPIRED:   <XCircle className="h-2.5 w-2.5" />,
};

const statusLabel: Record<SubscriptionStatus, string> = {
  PAID:      "Payé",
  PENDING:   "En attente",
  CANCELLED: "Annulé",
  EXPIRED:   "Expiré",
};

export const JetonCard: React.FC<JetonCardProps> = ({ subscription, isHistory = false, onClick }) => {
  const copy = (e: React.MouseEvent, text: string, label: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const { status, amount, currency, tokenId, paidAt, id } = subscription;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } } : undefined}
      className={cn(
        "relative w-full rounded-lg border border-(--card-border) shadow-(--card-shadow) bg-card p-4 text-card-foreground",
        "overflow-hidden transition-colors duration-150 motion-reduce:transition-none",
        onClick && "cursor-pointer hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <Wifi className="size-4 text-muted-foreground" />
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold tracking-wide">Accès Wi-Fi</span>
          <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium", statusTone[status])}>
            {statusIcon[status]}
            {statusLabel[status]}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3 font-mono text-lg font-bold tracking-wider text-foreground">
        {formatAmount(amount, currency)}
      </div>

      {/* Token reference */}
      <div className="mb-3 rounded-lg bg-muted/50 border border-border p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground mb-0.5">
              {tokenId ? "TOKEN" : "RÉFÉRENCE"}
            </p>
            <p className="font-mono text-xs tracking-wider truncate text-foreground">
              {tokenId ? `${tokenId.slice(0, 8)}…` : `${id.slice(0, 8)}…`}
            </p>
          </div>
          <button
            onClick={(e) => copy(e, tokenId ?? id, tokenId ? "Token" : "Référence")}
            className="flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
            title="Copier"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          {paidAt ? new Date(paidAt).toLocaleDateString("fr-FR") : "—"}
        </div>
        <div className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-medium">
          {isHistory ? "Historique" : "Actif"}
        </div>
      </div>
    </div>
  );
};
