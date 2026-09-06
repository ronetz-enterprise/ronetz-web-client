import React from "react";
import {
  Clock3,
  Database,
  Edit3,
  Smartphone,
  Trash2,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Forfait } from "@/modules/commerce/types";
import { formatData, formatDuration } from "@/shared/lib/format";
import { cn } from "@/lib/utils";

interface ForfaitCardProps {
  forfait: Forfait;
  onEdit?: (forfait: Forfait) => void;
  onDelete?: (forfait: Forfait) => void;
  onSelect?: (forfait: Forfait) => void;
  variant?: "admin" | "client";
}

const PlanMetric = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) => (
  <div className="min-w-0 rounded-xl border border-border/70 bg-background/70 p-3">
    <Icon className="mb-2 size-4 text-primary" aria-hidden="true" />
    <p className="truncate text-sm font-semibold text-foreground">{value}</p>
    <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
      {label}
    </p>
  </div>
);

export function ForfaitCard({
  forfait,
  onEdit,
  onDelete,
  onSelect,
  variant = "client",
}: ForfaitCardProps) {
  const isAvailable = forfait.active !== false;

  return (
    <Card
      className={cn(
        "ronet-plan group relative overflow-hidden border-border/80 py-0 transition duration-300",
        "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_24px_60px_-34px_hsl(var(--primary)/0.45)]",
        !isAvailable && "opacity-65"
      )}
    >
      <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
            <Wifi className="size-5" aria-hidden="true" />
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
              isAvailable
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-border bg-muted text-muted-foreground"
            )}
          >
            {isAvailable ? "Disponible" : "Indisponible"}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Forfait internet
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {forfait.name}
          </h3>
          {forfait.description && (
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {forfait.description}
            </p>
          )}
        </div>

        <div className="my-6 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-[-0.05em] text-foreground">
            {forfait.price}
          </span>
          <span className="pb-1 text-sm font-medium text-muted-foreground">FCFA</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <PlanMetric
            icon={Clock3}
            label="Durée"
            value={formatDuration(forfait.durationMinutes)}
          />
          <PlanMetric
            icon={Database}
            label="Volume"
            value={formatData(forfait.dataVolumeMb)}
          />
          <PlanMetric
            icon={Smartphone}
            label="Appareils"
            value={String(forfait.maxConcurrentDevices)}
          />
        </div>

        <div className="mt-auto pt-6">
          {variant === "admin" ? (
            <div className="flex gap-2 border-t border-border/70 pt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onEdit?.(forfait)}
              >
                <Edit3 className="size-4" aria-hidden="true" />
                Modifier
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete?.(forfait)}
                aria-label={"Supprimer " + forfait.name}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              disabled={!isAvailable}
              onClick={() => onSelect?.(forfait)}
            >
              Choisir ce forfait
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
