import React, { useState } from "react";
import { Copy, Eye, EyeOff, Wifi, Clock, Database, Users, Unplug, Activity } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { TokenDto, TokenStatus } from "../types";
import { formatData, formatDuration } from "@/shared/lib/format";
import { toast } from "sonner";
import { StatusBadge, type StatusBadgeTone } from "@/shared/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface TokenCredentialCardProps {
  token: TokenDto;
  onRevoke?: (id: string) => void;
}

const statusConfig: Record<TokenStatus, { label: string; tone: StatusBadgeTone }> = {
  ACTIVE:          { label: "Actif",         tone: "success" },
  REVOKED:         { label: "Révoqué",        tone: "danger" },
  QUOTA_EXHAUSTED: { label: "Quota atteint", tone: "warning" },
  EXPIRED:         { label: "Expiré",        tone: "neutral" },
};

export const TokenCredentialCard: React.FC<TokenCredentialCardProps> = ({ token, onRevoke }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const { label, tone } = statusConfig[token.status] ?? statusConfig.ACTIVE;

  const expiresDate = new Date(token.expiresAt);
  const isExpired = expiresDate < new Date();
  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / 86_400_000);

  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      token.status !== "ACTIVE" && "opacity-60"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-2 border-b">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Wifi className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-none truncate">Accès WiFi</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {isExpired ? "Expiré" : `Expire dans ${daysLeft} j`}
            </p>
          </div>
        </div>
        <StatusBadge tone={tone} className="text-[10px] shrink-0">
          {label}
        </StatusBadge>
      </div>

      {/* Credentials */}
      <div className="px-3.5 py-2.5 grid grid-cols-2 gap-2">
        {/* Username */}
        <div className="rounded-md bg-muted/50 border px-2.5 py-1.5 min-w-0">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
            Identifiant
          </p>
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-xs font-medium tracking-tight truncate">
              {token.username}
            </span>
            <button
              onClick={() => copy(token.username, "Identifiant")}
              className="shrink-0 p-1 rounded hover:bg-accent transition-colors"
              title="Copier l'identifiant"
            >
              <Copy className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="rounded-md bg-muted/50 border px-2.5 py-1.5 min-w-0">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
            Mot de passe
          </p>
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-xs font-medium tracking-tight truncate">
              {token.passwordClear
                ? showPassword ? token.passwordClear : "••••••••"
                : <span className="text-muted-foreground text-[10px] italic">n/a</span>
              }
            </span>
            <div className="flex items-center gap-0.5 shrink-0">
              {token.passwordClear && (
                <>
                  <button
                    onClick={() => setShowPassword(v => !v)}
                    className="p-1 rounded hover:bg-accent transition-colors"
                    title={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword
                      ? <EyeOff className="h-3 w-3 text-muted-foreground" />
                      : <Eye className="h-3 w-3 text-muted-foreground" />
                    }
                  </button>
                  <button
                    onClick={() => copy(token.passwordClear!, "Mot de passe")}
                    className="p-1 rounded hover:bg-accent transition-colors"
                    title="Copier le mot de passe"
                  >
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center gap-3 px-3.5 pb-2.5 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDuration(token.durationMinutes)}
        </span>
        <span className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          {formatData(token.dataVolumeMb)}
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {token.maxConcurrentDevices}
        </span>
      </div>

      {/* Actions */}
      {token.status === "ACTIVE" && (
        <div className="flex items-center justify-between gap-2 px-3.5 pb-2.5 border-t pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => navigate(`/mes-acces?token=${token.id}`)}
          >
            <Activity className="mr-1 h-3 w-3" />
            Détails
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (window.confirm("Déconnecter cet accès WiFi ? Il ne sera plus utilisable.")) {
                onRevoke?.(token.id);
              }
            }}
          >
            <Unplug className="mr-1 h-3 w-3" />
            Déconnecter
          </Button>
        </div>
      )}
    </div>
  );
};
