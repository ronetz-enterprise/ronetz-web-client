import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMesSubscriptions } from "@/modules/commerce/hooks/useMesSubscriptions";
import type { SubscriptionStatus } from "@/modules/commerce/types";
import { JetonCard } from "@/modules/access-sessions/components/JetonCard";
import { formatAmount } from "@/shared/lib/format";
import { ArrowLeft, Ticket, Copy, KeyRound, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";
import { toast } from "sonner";

// Page dédiée à la description d'une souscription (voir /souscriptions pour la liste).

const statusConfig: Record<SubscriptionStatus, { label: string; tone: StatusBadgeTone }> = {
  PENDING:   { label: "En attente", tone: "warning" },
  PAID:      { label: "Payé",       tone: "success" },
  CANCELLED: { label: "Annulé",     tone: "neutral" },
  EXPIRED:   { label: "Expiré",     tone: "danger" },
};

const SouscriptionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subscriptions, loading, cancel } = useMesSubscriptions();

  const sub = subscriptions.find((s) => s.id === id) ?? null;

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-56 rounded-lg max-w-sm" />
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/souscriptions")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="py-20 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Cette transaction est introuvable.</p>
        </div>
      </div>
    );
  }

  const sc = statusConfig[sub.status];

  return (
    <div>
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate("/souscriptions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight flex-1">Transaction</h1>
        <StatusBadge tone={sc.tone} className="text-[11px]">{sc.label}</StatusBadge>
      </div>

      <div className="p-6 max-w-2xl space-y-6">
        <div className="max-w-sm">
          <JetonCard subscription={sub} isHistory={sub.status === "CANCELLED" || sub.status === "EXPIRED"} />
        </div>

        <div className="rounded-lg border overflow-hidden">
          <div className="px-3.5 py-2 border-b bg-muted/30">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Détails</p>
          </div>
          <div className="px-3.5 divide-y">
            <div className="flex items-center justify-between gap-2 py-2.5">
              <span className="text-[11px] text-muted-foreground">Référence</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-mono font-medium">{sub.id}</span>
                <button onClick={() => copy(sub.id, "Référence")} className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Copier">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 py-2.5">
              <span className="text-[11px] text-muted-foreground">Montant</span>
              <span className="text-sm font-semibold">{formatAmount(sub.amount, sub.currency)}</span>
            </div>
            <div className="flex items-center justify-between gap-2 py-2.5">
              <span className="text-[11px] text-muted-foreground">Payé le</span>
              <span className="text-sm font-medium">
                {sub.paidAt ? new Date(sub.paidAt).toLocaleString("fr-FR") : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t pt-4">
          {sub.tokenId ? (
            <Button variant="outline" size="sm" onClick={() => navigate(`/mes-acces/${sub.tokenId}`)}>
              <KeyRound className="mr-1.5 h-3.5 w-3.5" />
              Voir l'accès associé
            </Button>
          ) : <span />}

          {sub.status === "PENDING" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (window.confirm("Annuler cette transaction ?")) {
                  cancel(sub.id);
                }
              }}
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Annuler
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SouscriptionDetailPage;
