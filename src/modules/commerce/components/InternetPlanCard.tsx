import { Check, Clock3, Database, Smartphone, Wifi } from "lucide-react";
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
    <button
      type="button"
      onClick={() => onSelect?.(forfait)}
      disabled={!isAvailable}
      aria-pressed={selected}
      className={cn(
        "group block h-full w-full rounded-[1.35rem] text-left outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className
      )}
    >
      <Card
        className={cn(
          "ronet-plan relative h-full overflow-hidden border-border/80 py-0 transition duration-300",
          "group-hover:-translate-y-0.5 group-hover:border-primary/35 group-hover:shadow-[0_24px_60px_-34px_hsl(var(--primary)/0.45)]",
          selected && "border-primary bg-primary/[0.045] ring-2 ring-primary/20",
          !isAvailable && "cursor-not-allowed opacity-55"
        )}
      >
        <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div
              className={cn(
                "flex size-11 items-center justify-center rounded-2xl border transition-colors",
                selected
                  ? "border-primary/25 bg-primary text-primary-foreground"
                  : "border-primary/15 bg-primary/10 text-primary"
              )}
            >
              {selected ? (
                <Check className="size-5" aria-hidden="true" />
              ) : (
                <Wifi className="size-5" aria-hidden="true" />
              )}
            </div>
            <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {selected ? "Sélectionné" : isAvailable ? "Disponible" : "Indisponible"}
            </span>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Connexion Ronet
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

          <div className="my-6">
            <span className="text-3xl font-semibold tracking-[-0.045em] text-foreground">
              {formatAmount(forfait.price, forfait.currency)}
            </span>
          </div>

          <dl className="grid gap-3 border-t border-border/70 pt-4">
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="size-4 text-primary" aria-hidden="true" />
                Durée
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {formatDuration(forfait.durationMinutes)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="size-4 text-primary" aria-hidden="true" />
                Données
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {formatData(forfait.dataVolumeMb)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smartphone className="size-4 text-primary" aria-hidden="true" />
                Appareils
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {forfait.maxConcurrentDevices}
              </dd>
            </div>
          </dl>

          <div
            className={cn(
              "mt-6 rounded-xl px-4 py-3 text-center text-sm font-semibold transition-colors",
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background group-hover:bg-primary"
            )}
          >
            {selected ? "Forfait sélectionné" : "Sélectionner"}
          </div>
        </div>
      </Card>
    </button>
  );
}
