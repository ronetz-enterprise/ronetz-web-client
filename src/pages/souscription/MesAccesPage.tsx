import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMyTokens } from "@/modules/access-sessions/hooks/useMyTokens";
import { useMesSubscriptions } from "@/modules/commerce/hooks/useMesSubscriptions";
import { tokenApi } from "@/modules/access-sessions/api/tokenApi";
import type { TokenDto, TokenStatus, TokenUsageDto } from "@/modules/access-sessions/types";
import {
  formatData, formatDuration,
} from "@/shared/lib/format";
import {
  Wifi, Copy, Eye, EyeOff, Unplug, Loader2, Database,
  Smartphone, Timer, Clock, Users, RefreshCw, Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

const tokenStatusConfig: Record<TokenStatus, { label: string; tone: StatusBadgeTone }> = {
  ACTIVE:          { label: "Actif",         tone: "success" },
  REVOKED:         { label: "Révoqué",       tone: "danger" },
  QUOTA_EXHAUSTED: { label: "Quota atteint", tone: "warning" },
  EXPIRED:         { label: "Expiré",        tone: "neutral" },
};

function expiryLabel(expiresAt: string): string {
  const expiresDate = new Date(expiresAt);
  if (expiresDate < new Date()) return "Expiré";
  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / 86_400_000);
  return `Expire dans ${daysLeft} j${daysLeft !== 1 ? "s" : ""}`;
}

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

const MesAccesPage: React.FC = () => {
  const { tokens, loading: tokLoading, refresh: refreshTokens, revoke } = useMyTokens();
  const { loading: subLoading, refresh: refreshSubs } = useMesSubscriptions();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("token"));
  const [usageMap, setUsageMap] = useState<Record<string, TokenUsageDto>>({});
  const [usageFetching, setUsageFetching] = useState(false);

  const loading = tokLoading || subLoading;
  const refresh = () => { refreshTokens(); refreshSubs(); };

  // Derive the effective selection: honor an explicit pick, else fall back to
  // the first active token (or just the first one) once tokens are loaded.
  const effectiveId = selectedId && tokens.some((t) => t.id === selectedId)
    ? selectedId
    : (tokens.find((t) => t.status === "ACTIVE") ?? tokens[0])?.id ?? null;

  const selectToken = (id: string) => {
    setSelectedId(id);
    setSearchParams({ token: id }, { replace: true });
  };

  // Bulk-fetch consumption for every token so both the list rows and the
  // details panel can show data usage without an extra round trip per click.
  useEffect(() => {
    if (tokens.length === 0) return;
    let cancelled = false;
    const load = () => {
      setUsageFetching(true);
      Promise.allSettled(tokens.map((t) => tokenApi.getUsage(t.id)))
        .then((results) => {
          if (cancelled) return;
          const next: Record<string, TokenUsageDto> = {};
          results.forEach((r, i) => { if (r.status === "fulfilled") next[tokens[i].id] = r.value.data; });
          setUsageMap(next);
        })
        .finally(() => { if (!cancelled) setUsageFetching(false); });
    };
    load();
    return () => { cancelled = true; };
  }, [tokens]);

  const selectedToken = tokens.find((t) => t.id === effectiveId) ?? null;

  return (
    <div className="space-y-0 h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-2 border-b">
        <h1 className="text-xl font-semibold tracking-tight">Mes Accès</h1>
        <Button variant="ghost" size="icon" onClick={refresh} title="Actualiser">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className=" grid grid-cols-1 lg:grid-cols-[400px_1fr]  items-start flex-1">
        {/* Left column: token list + latest transactions */}
        <div className="border-r h-full">
          <div  className="ring-0 p-0 m-0">
            
              {tokLoading ? (
                <div className="p-3 space-y-2">
                  {[1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-md" />)}
                </div>
              ) : tokens.length === 0 ? (
                <p className="px-4 pb-4 text-sm text-muted-foreground">Aucun accès pour l'instant.</p>
              ) : (
                <div className="divide-y">
                  {tokens.map((t) => {
                    const isSelected = t.id === effectiveId;
                    const tUsage = usageMap[t.id];
                    const consumedLabel = tUsage ? formatConsumed(tUsage.consumedBytes) : usageFetching ? "…" : "0 Mo";
                    return (
                      <button
                        key={t.id}
                        onClick={() => selectToken(t.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors",
                          isSelected ? "bg-primary/5  border-l-primary" : " hover:bg-muted/40"
                        )}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <p className="text-sm font-semibold truncate leading-none">{t.siteName}</p>
                          <div className="flex flex-col  gap-3 text-[11px] text-muted-foreground">
                            <div className="flex items-end ">
                              <Database className="h-3 w-" />
                              <span className="text-[16px] h-[18px] font-semibold">{consumedLabel} </span>
                              <span className=" h-[12px] ">/ {formatData(t.dataVolumeMb)}</span>
                            </div>
                            <div className="flex justify-end  gap-1">
                              <Clock className="h-3 w-3" />
                              {expiryLabel(t.expiresAt)}
                            </div>
                          </div>
                        </div>
                        {/* <StatusBadge tone={sc.tone} className="text-[10px] shrink-0">
                          {sc.label}
                        </StatusBadge> */}
                      </button>
                    );
                  })}
                </div>
              )}
          </div>
        </div>

        {/* Right column: details panel */}
        <TokenDetailsPanel
          token={selectedToken}
          usage={(effectiveId && usageMap[effectiveId]) || null}
          usageLoading={usageFetching && !(effectiveId && effectiveId in usageMap)}
          onRevoke={revoke}
        />
      </div>
    </div>
  );
};

interface TokenDetailsPanelProps {
  token: TokenDto | null;
  usage: TokenUsageDto | null;
  usageLoading: boolean;
  onRevoke: (id: string) => void;
}

const TokenDetailsPanel: React.FC<TokenDetailsPanelProps> = ({ token, usage, usageLoading, onRevoke }) => {
  const [showPassword, setShowPassword] = useState(false);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  if (!token) {
    return (
      <Card size="sm" className="h-full ring-0">
        <CardContent className="py-20 text-center space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-muted mx-auto">
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Sélectionnez un accès pour afficher ses détails.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sc = tokenStatusConfig[token.status] ?? tokenStatusConfig.ACTIVE;
  const expiresDate = new Date(token.expiresAt);
  const isExpired = expiresDate < new Date();
  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / 86_400_000);
  const percent = usage?.percentUsed ?? null;
  const barTone = percent === null ? "bg-primary" : percent >= 90 ? "bg-destructive" : percent >= 70 ? "bg-(--accent-yellow)" : "bg-primary";

  return (
    <Card size="sm" className="ring-0 ">
      <CardHeader className="border-b [.border-b]:pb-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Wifi className="h-4 w-4 text-primary" />
            {token.siteName}
          </CardTitle>
          <StatusBadge tone={sc.tone} className="text-[11px]">{sc.label}</StatusBadge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono">{token.username}</span>
          <span>{isExpired ? "Expiré" : `Expire dans ${daysLeft} jour${daysLeft !== 1 ? "s" : ""}`}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ticket description + connection info */}
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

        {/* Session history + remaining usage */}
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

        {/* Actions */}
        {token.status === "ACTIVE" && (
          <div className="flex justify-end border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (window.confirm("Déconnecter cet accès WiFi ? Il ne sera plus utilisable.")) {
                  onRevoke(token.id);
                }
              }}
            >
              <Unplug className="mr-1.5 h-3.5 w-3.5" />
              Déconnecter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MesAccesPage;
