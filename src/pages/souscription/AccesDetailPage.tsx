import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMyTokens } from "@/modules/access-sessions/hooks/useMyTokens";
import { tokenApi } from "@/modules/access-sessions/api/tokenApi";
import type { TokenStatus, TokenUsageDto } from "@/modules/access-sessions/types";
import { formatData, formatDuration } from "@/shared/lib/format";
import {
  ArrowLeft, Wifi, Copy, Eye, EyeOff, Unplug, Loader2, Database,
  Smartphone, Timer, Clock, Users, Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

// Page dédiée à la description d'un accès (ex-panneau de détail de AccesSection, avant la
// fusion en onglets — voir /mes-acces pour la liste). Un seul appel tokenApi.getUsage(id),
// pas un fetch pour tous les tokens comme le faisait l'ancienne vue en split-pane.

const tokenStatusConfig: Record<TokenStatus, { label: string; tone: StatusBadgeTone }> = {
  ACTIVE:          { label: "Actif",         tone: "success" },
  REVOKED:         { label: "Révoqué",       tone: "danger" },
  QUOTA_EXHAUSTED: { label: "Quota atteint", tone: "warning" },
  EXPIRED:         { label: "Expiré",        tone: "neutral" },
};

function formatConsumed(bytes: number): string {
  return formatData(Math.round(bytes / (1024 * 1024)));
}

interface InfoRowProps {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  actions?: React.ReactNode;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value, mono, actions }) => (
  <div className="flex items-center justify-between gap-2 py-2">
    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </span>
    <div className="flex items-center gap-1 min-w-0">
      <span className={cn("text-sm font-medium truncate", mono && "font-mono")}>{value}</span>
      {actions}
    </div>
  </div>
);

interface InfoPanelProps {
  title: string;
  children: React.ReactNode;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ title, children }) => (
  <div className="rounded-lg border overflow-hidden h-full">
    <div className="px-3.5 py-2 border-b bg-muted/30">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
    </div>
    <div className="px-3.5 divide-y">{children}</div>
  </div>
);

const AccesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tokens, loading: tokensLoading, revoke } = useMyTokens();
  const [showPassword, setShowPassword] = useState(false);
  const [usage, setUsage] = useState<TokenUsageDto | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);

  const token = tokens.find((t) => t.id === id) ?? null;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = () => {
      setUsageLoading(true);
      tokenApi.getUsage(id)
        .then(({ data }) => { if (!cancelled) setUsage(data); })
        .catch(() => { if (!cancelled) setUsage(null); })
        .finally(() => { if (!cancelled) setUsageLoading(false); });
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  if (tokensLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-6 space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/mes-acces")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <div className="py-20 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Cet accès est introuvable.</p>
        </div>
      </div>
    );
  }

  const sc = tokenStatusConfig[token.status] ?? tokenStatusConfig.ACTIVE;
  const expiresDate = new Date(token.expiresAt);
  const isExpired = expiresDate < new Date();
  const daysLeft = Math.ceil((expiresDate.getTime() - new Date().getTime()) / 86_400_000);
  const percent = usage?.percentUsed ?? null;
  const barTone = percent === null ? "bg-primary" : percent >= 90 ? "bg-destructive" : percent >= 70 ? "bg-(--accent-yellow)" : "bg-primary";

  return (
    <div>
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mes-acces")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2 truncate">
            <Wifi className="h-4 w-4 text-primary shrink-0" />
            {token.siteName}
          </h1>
          <p className="text-xs text-muted-foreground font-mono">{token.username}</p>
        </div>
        <StatusBadge tone={sc.tone} className="text-[11px] shrink-0">{sc.label}</StatusBadge>
      </div>

      <div className="p-6 max-w-4xl space-y-4">
        <p className="text-xs text-muted-foreground">
          {isExpired ? "Expiré" : `Expire dans ${daysLeft} jour${daysLeft !== 1 ? "s" : ""}`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoPanel title="Forfait">
            <InfoRow icon={Database} label="Volume" value={formatData(token.dataVolumeMb)} />
            <InfoRow icon={Clock} label="Durée" value={formatDuration(token.durationMinutes)} />
            <InfoRow icon={Users} label="Appareils" value={`${token.maxConcurrentDevices} max`} />
          </InfoPanel>

          <InfoPanel title="Connexion">
            <InfoRow
              label="Identifiant"
              mono
              value={token.username}
              actions={
                <button onClick={() => copy(token.username, "Identifiant")} className="shrink-0 p-1.5 rounded-md hover:bg-accent transition-colors" title="Copier l'identifiant">
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              }
            />
            <InfoRow
              label="Mot de passe"
              mono
              value={
                token.passwordClear
                  ? showPassword ? token.passwordClear : "••••••••••••"
                  : <span className="text-muted-foreground text-xs italic">non disponible</span>
              }
              actions={token.passwordClear && (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setShowPassword((v) => !v)} className="p-1.5 rounded-md hover:bg-accent transition-colors" title={showPassword ? "Masquer" : "Afficher"}>
                    {showPassword ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : <Eye className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                  <button onClick={() => copy(token.passwordClear!, "Mot de passe")} className="p-1.5 rounded-md hover:bg-accent transition-colors" title="Copier le mot de passe">
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              )}
            />
          </InfoPanel>
        </div>

        {usageLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : usage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
            <div className="rounded-lg border overflow-hidden">
              <div className="px-3.5 py-2 border-b bg-muted/30">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Historique des sessions</p>
              </div>
              {usage.recentSessions.length > 0 ? (
                <ScrollArea className="h-56">
                  <div className="divide-y">
                    {usage.recentSessions.map((s, i) => (
                      <div key={i} className="px-3.5 py-2.5 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{new Date(s.startedAt).toLocaleString("fr-FR")}</span>
                          <span className={cn("text-[10px] font-medium", s.endedAt ? "text-muted-foreground" : "text-(--accent-green)")}>
                            {s.endedAt ? "Terminée" : "En cours"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span>Données</span>
                          <span className="font-medium text-foreground">{formatConsumed(s.bytesUsed)}</span>
                        </div>
                        {s.terminateCause && (
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>Cause</span>
                            <span className="font-medium text-foreground">{s.terminateCause}</span>
                          </div>
                        )}
                        {s.nasIp && (
                          <div className="flex items-center justify-between text-muted-foreground">
                            <span>IP</span>
                            <span className="font-mono font-medium text-foreground">{s.nasIp}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  Aucune session enregistrée
                </p>
              )}
            </div>

            <InfoPanel title="Consommation">
              <div className="py-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Volume consommé</span>
                  <span className="font-medium">
                    {formatConsumed(usage.consumedBytes)}
                    {usage.limitBytes !== null && ` / ${formatConsumed(usage.limitBytes)}`}
                    {usage.limitBytes === null && " (illimité)"}
                  </span>
                </div>
                {usage.limitBytes !== null && (
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", barTone)} style={{ width: `${Math.min(100, percent ?? 0)}%` }} />
                  </div>
                )}
              </div>
              <InfoRow
                icon={Database}
                label="Volume restant"
                value={usage.limitBytes !== null ? formatConsumed(Math.max(0, usage.limitBytes - usage.consumedBytes)) : "Illimité"}
              />
              <InfoRow
                icon={Timer}
                label="Temps restant"
                value={usage.remainingSeconds > 0 ? formatDuration(Math.ceil(usage.remainingSeconds / 60)) : "Expiré"}
              />
              <InfoRow icon={Smartphone} label="Appareils actifs" value={usage.activeDeviceCount} />
            </InfoPanel>
          </div>
        ) : null}

        {token.status === "ACTIVE" && (
          <div className="flex justify-end border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (window.confirm("Déconnecter cet accès WiFi ? Il ne sera plus utilisable.")) {
                  revoke(token.id);
                }
              }}
            >
              <Unplug className="mr-1.5 h-3.5 w-3.5" />
              Déconnecter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccesDetailPage;
