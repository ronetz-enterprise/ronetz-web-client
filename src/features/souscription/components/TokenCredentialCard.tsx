import React, { useState } from "react";
import { Copy, Eye, EyeOff, Wifi, Clock, Database, Users } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { TokenDto, TokenStatus } from "@/shared/types";
import { formatData, formatDuration } from "@/shared/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface TokenCredentialCardProps {
  token: TokenDto;
}

const statusConfig: Record<TokenStatus, { label: string; className: string }> = {
  ACTIVE:          { label: "Actif",          className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  REVOKED:         { label: "Révoqué",         className: "bg-red-500/15 text-red-600 border-red-500/20" },
  QUOTA_EXHAUSTED: { label: "Quota atteint",  className: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  EXPIRED:         { label: "Expiré",         className: "bg-zinc-500/15 text-zinc-500 border-zinc-500/20" },
};

export const TokenCredentialCard: React.FC<TokenCredentialCardProps> = ({ token }) => {
  const [showPassword, setShowPassword] = useState(false);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const { label, className: statusClass } = statusConfig[token.status] ?? statusConfig.ACTIVE;

  const expiresDate = new Date(token.expiresAt);
  const isExpired = expiresDate < new Date();
  const daysLeft = Math.ceil((expiresDate.getTime() - Date.now()) / 86_400_000);

  return (
    <div className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      token.status !== "ACTIVE" && "opacity-60"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Wifi className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Accès WiFi</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {isExpired ? "Expiré" : `Expire dans ${daysLeft} jour${daysLeft !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-[11px] font-medium", statusClass)}>
          {label}
        </Badge>
      </div>

      {/* Credentials */}
      <div className="px-5 py-4 space-y-3">
        {/* Username */}
        <div className="rounded-lg bg-muted/50 border px-3.5 py-2.5">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-medium">
            Identifiant
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-medium tracking-tight truncate">
              {token.username}
            </span>
            <button
              onClick={() => copy(token.username, "Identifiant")}
              className="shrink-0 p-1.5 rounded-md hover:bg-accent transition-colors"
              title="Copier l'identifiant"
            >
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="rounded-lg bg-muted/50 border px-3.5 py-2.5">
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-medium">
            Mot de passe
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-sm font-medium tracking-tight truncate">
              {token.passwordClear
                ? showPassword ? token.passwordClear : "••••••••••••"
                : <span className="text-muted-foreground text-xs italic">non disponible</span>
              }
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {token.passwordClear && (
                <>
                  <button
                    onClick={() => setShowPassword(v => !v)}
                    className="p-1.5 rounded-md hover:bg-accent transition-colors"
                    title={showPassword ? "Masquer" : "Afficher"}
                  >
                    {showPassword
                      ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                      : <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    }
                  </button>
                  <button
                    onClick={() => copy(token.passwordClear!, "Mot de passe")}
                    className="p-1.5 rounded-md hover:bg-accent transition-colors"
                    title="Copier le mot de passe"
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="flex items-center gap-4 px-5 pb-4 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {formatDuration(token.durationMinutes)}
        </span>
        <span className="flex items-center gap-1.5">
          <Database className="h-3 w-3" />
          {formatData(token.dataVolumeMb)}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          {token.maxConcurrentDevices} appareil{token.maxConcurrentDevices > 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
};
