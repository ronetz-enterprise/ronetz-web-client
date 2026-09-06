import { Check, Clock3, Database, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { formatAmount, formatData, formatDuration } from "@/shared/lib/format";
import type { Forfait } from "../types";

interface InternetPlanCardProps {
  forfait: Forfait;
  selected?: boolean;
  onSelect?: (forfait: Forfait) => void;
  className?: string;
}

export function InternetPlanCard({
  forfait,
  selected = false,
  onSelect,
  className,
}: InternetPlanCardProps) {
  const isAvailable = Boolean(forfait.active);

  return (
    <Card
      className={cn(
        "h-full border-border bg-card py-0 shadow-none transition-colors",
        selected && "border-primary ring-1 ring-primary",
        !isAvailable && "opacity-55",
        className
      )}
    >
      <div className="flex h-full min-h-60 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {forfait.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {formatDuration(forfait.durationMinutes)}
            </p>
          </div>
          {selected && (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3.5" aria-hidden="true" />
            </span>
          )}
        </div>

        <p className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          {formatAmount(forfait.price, forfait.currency)}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Database className="size-3.5" aria-hidden="true" />
              Données
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {formatData(forfait.dataVolumeMb)}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Smartphone className="size-3.5" aria-hidden="true" />
              Appareils
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {forfait.maxConcurrentDevices}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => onSelect?.(forfait)}
          disabled={!isAvailable}
          aria-pressed={selected}
          className={cn(
            "mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            selected
              ? "bg-primary text-primary-foreground"
              : "bg-foreground text-background hover:bg-primary",
            !isAvailable && "cursor-not-allowed"
          )}
        >
          <Clock3 className="size-4" aria-hidden="true" />
          {selected ? "Sélectionné" : isAvailable ? "Choisir" : "Indisponible"}
        </button>
      </div>
    </Card>
  );
}