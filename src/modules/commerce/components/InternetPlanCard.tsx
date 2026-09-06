import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Forfait } from "../types";
import { formatData, formatDuration } from "@/shared/lib/format";
import { Card } from "@/components/ui/card";

interface ForfaitCardProps {
  forfait: Forfait;
  selected?: boolean;
  onSelect?: (forfait: Forfait) => void;
  className?: string;
}

export const InternetPlanCard: React.FC<ForfaitCardProps> = ({ forfait, selected, onSelect, className }) => (
  <Card
    role={onSelect ? "button" : undefined}
    tabIndex={onSelect ? 0 : undefined}
    aria-pressed={onSelect ? Boolean(selected) : undefined}
    onClick={() => onSelect?.(forfait)}
    onKeyDown={(event) => {
      if (onSelect && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onSelect(forfait);
      }
    }}
    className={cn(
      "h-full min-w-0 gap-4 p-4 transition-colors duration-150 motion-reduce:transition-none",
      onSelect && "cursor-pointer hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      selected && "border-primary bg-primary/5",
      className,
    )}
  >
    <div className="flex items-start justify-between gap-2">
      <h3 className="min-w-0 truncate text-sm font-semibold" title={forfait.name}>{forfait.name}</h3>
      {selected && <Check aria-label="Sélectionné" className="size-4 shrink-0 text-primary" />}
    </div>
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums">{new Intl.NumberFormat("fr-FR").format(forfait.price)}</span>
      <span className="text-xs text-muted-foreground">{forfait.currency} · {formatDuration(forfait.durationMinutes)}</span>
    </div>
    <dl className="mt-auto space-y-2 border-t pt-3 text-xs">
      <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Données</dt><dd className="font-mono">{formatData(forfait.dataVolumeMb)}</dd></div>
      <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Appareils</dt><dd className="font-mono">{forfait.maxConcurrentDevices}</dd></div>
      <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Disponibilité</dt><dd className={forfait.active ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}>{forfait.active ? "Disponible" : "Indisponible"}</dd></div>
    </dl>
  </Card>
);
