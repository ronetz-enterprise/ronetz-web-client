import React from "react";
import { Clock3, Database, Edit3, Smartphone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Forfait } from "../types";
import { formatAmount, formatData, formatDuration } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface ForfaitCardProps {
  forfait: Forfait;
  onEdit?: (forfait: Forfait) => void;
  onDelete?: (id: string) => void;
  onSelect?: (forfait: Forfait) => void;
  variant?: "admin" | "client";
}

export const ForfaitCard: React.FC<ForfaitCardProps> = ({
  forfait,
  onEdit,
  onDelete,
  onSelect,
  variant = "admin",
}) => {
  const active = Boolean(forfait.active);

  return (
    <Card className={cn("h-full border-border bg-card py-0 shadow-none", !active && "opacity-60")}>
      <div className="flex h-full min-h-56 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{forfait.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatDuration(forfait.durationMinutes)}
            </p>
          </div>
          <span
            className={cn(
              "rounded-full px-2 py-1 text-[11px] font-medium",
              active
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "bg-muted text-muted-foreground"
            )}
          >
            {active ? "Actif" : "Inactif"}
          </span>
        </div>

        <p className="mt-4 text-2xl font-semibold tracking-tight">
          {formatAmount(forfait.price, forfait.currency)}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Database className="size-3.5" aria-hidden="true" />
              Données
            </dt>
            <dd className="mt-1 text-sm font-medium">{formatData(forfait.dataVolumeMb)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Smartphone className="size-3.5" aria-hidden="true" />
              Appareils
            </dt>
            <dd className="mt-1 text-sm font-medium">{forfait.maxConcurrentDevices}</dd>
          </div>
        </dl>

        <div className="mt-auto flex gap-2 pt-5">
          {variant === "client" ? (
            <Button className="w-full" disabled={!active} onClick={() => onSelect?.(forfait)}>
              <Clock3 className="size-4" aria-hidden="true" />
              Choisir
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit?.(forfait)}>
                <Edit3 className="size-4" aria-hidden="true" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete?.(forfait.id)}
                aria-label={"Supprimer " + forfait.name}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
