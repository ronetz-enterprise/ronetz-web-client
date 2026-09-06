import React, { useEffect, useState } from "react";
import { Wifi, Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { TokenDto, TokenUsageDto } from "../types";
import { tokenApi } from "../api/tokenApi";
import { formatData } from "@/shared/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface TokenCredentialCardProps {
  token: TokenDto;
}

function formatConsumed(bytes: number): string {
  return formatData(Math.round(bytes / (1024 * 1024)));
}

// Card is a glanceable summary only: site name, data used, expiry. Everything
// else (credentials, duration, devices, session history, disconnect...)
// lives on AccesDetailPage — the whole card is the entry point to it, no
// separate footer/buttons.
//
// The data-usage line does the heavy lifting visually: a quota bar (same
// language as AccesDetailPage's "Consommation" panel) reads at a glance,
// where a plain number doesn't. Same reasoning for the expiry pill — status
// at a glance, color escalating as it gets close, without adding a row.
export const TokenCredentialCard: React.FC<TokenCredentialCardProps> = ({ token }) => {
  const navigate = useNavigate();
  const [usage, setUsage] = useState<TokenUsageDto | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);

  useEffect(() => {
    // Card is keyed by token.id in the parent list, so a mounted instance
    // never sees its id change — no need to reset usageLoading here, the
    // initial `true` already covers it.
    let cancelled = false;
    tokenApi.getUsage(token.id)
      .then(({ data }) => { if (!cancelled) setUsage(data); })
      .catch(() => { if (!cancelled) setUsage(null); })
      .finally(() => { if (!cancelled) setUsageLoading(false); });
    return () => { cancelled = true; };
  }, [token.id]);

  const expiresDate = new Date(token.expiresAt);
  const isExpired = expiresDate < new Date();
  const daysLeft = Math.ceil((expiresDate.getTime() - new Date().getTime()) / 86_400_000);
  const expiringSoon = !isExpired && daysLeft <= 3;

  const isUnlimited = usage?.limitBytes == null;
  const percent = usage?.percentUsed ?? 0;
  const barTone = percent >= 90 ? "bg-destructive" : percent >= 70 ? "bg-(--accent-yellow)" : "bg-primary";

  const goToDetails = () => navigate(`/mes-acces/${token.id}`);

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goToDetails(); } }}
      className={cn(
        "gap-0 p-5 cursor-pointer outline-none ",
        "transition-colors duration-150 hover:border-primary/40 motion-reduce:transition-none",
        "focus-visible:ring-2 focus-visible:ring-ring/50",
        token.status !== "ACTIVE" && "opacity-60"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
            <Wifi className="size-4 text-muted-foreground" />
          </div>
          <p className="text-[15px] font-semibold leading-tight truncate">{token.siteName}</p>
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium",
            isExpired
              ? "bg-destructive/10 text-destructive"
              : expiringSoon
              ? "bg-(--accent-yellow)/15 text-(--accent-yellow)"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Clock className="size-3" />
          {isExpired ? "Expiré" : `${daysLeft} j`}
        </div>
      </div>

      {/* Data usage */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Données utilisées</span>
          {usageLoading ? (
            <Skeleton className="h-3.5 w-16" />
          ) : (
            <span className="font-medium tabular-nums">
              {formatConsumed(usage?.consumedBytes ?? 0)}
              {!isUnlimited && ` / ${formatConsumed(usage!.limitBytes!)}`}
              {isUnlimited && " · illimité"}
            </span>
          )}
        </div>
        {usageLoading ? (
          <Skeleton className="h-1.5 w-full rounded-full" />
        ) : !isUnlimited ? (
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", barTone)}
              style={{ width: `${Math.min(100, percent)}%` }}
            />
          </div>
        ) : (
          <div className="h-1.5 w-full rounded-full bg-primary/15" />
        )}
      </div>
    </Card>
  );
};
