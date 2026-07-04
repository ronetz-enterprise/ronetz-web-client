import React from "react";
import { Clock, Copy, Wifi, CheckCircle2, AlertCircle, Ban, XCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SubscriptionDto, SubscriptionStatus } from "@/shared/types";
import { formatAmount } from "@/shared/types";
import { toast } from "sonner";

interface JetonCardProps {
  subscription: SubscriptionDto;
  isHistory?: boolean;
}

const statusGradient: Record<SubscriptionStatus, string> = {
  PAID:      "from-emerald-500 to-emerald-700",
  PENDING:   "from-amber-500 to-orange-600",
  CANCELLED: "from-zinc-500 to-zinc-700",
  EXPIRED:   "from-zinc-700 to-zinc-900",
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

export const JetonCard: React.FC<JetonCardProps> = ({ subscription, isHistory = false }) => {
  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const { status, amount, currency, tokenId, paidAt, id } = subscription;

  return (
    <div
      className={cn(
        "group relative w-full aspect-[1.7] rounded-xl p-5",
        "overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        "text-white bg-gradient-to-br",
        statusGradient[status]
      )}
    >
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Background circle */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

      <Wifi className="absolute right-5 top-5 h-5 w-5 opacity-40" />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="h-7 w-10 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-sm" />
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm font-semibold tracking-wide">Rik</span>
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-white/20">
            {statusIcon[status]}
            {statusLabel[status]}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3 font-mono text-lg font-bold tracking-wider text-white/95">
        {formatAmount(amount, currency)}
      </div>

      {/* Token reference */}
      <div className="mb-3 rounded-lg bg-black/25 backdrop-blur-sm border border-white/10 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-white/50 mb-0.5">
              {tokenId ? "TOKEN" : "RÉFÉRENCE"}
            </p>
            <p className="font-mono text-xs tracking-wider truncate text-white/90">
              {tokenId ? `${tokenId.slice(0, 8)}…` : `${id.slice(0, 8)}…`}
            </p>
          </div>
          <button
            onClick={() => copy(tokenId ?? id, tokenId ? "Token" : "Référence")}
            className="shrink-0 p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
            title="Copier"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-end justify-between text-xs">
        <div className="flex items-center gap-1.5 text-white/70">
          <Clock className="h-3 w-3" />
          {paidAt ? new Date(paidAt).toLocaleDateString("fr-FR") : "—"}
        </div>
        <div className="px-2 py-0.5 rounded-md bg-white/15 text-white/80 text-[10px] font-medium">
          {isHistory ? "Historique" : "Actif"}
        </div>
      </div>
    </div>
  );
};
