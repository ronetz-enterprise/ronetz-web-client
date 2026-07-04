import React from "react";
import { Wifi, Smartphone, Database } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { type Forfait, formatData } from "@/shared/types";

interface ForfaitCardProps {
  forfait: Forfait;
  onSelect?: (forfait: Forfait) => void;
}

export const InternetPlanCard: React.FC<ForfaitCardProps> = ({ forfait, onSelect }) => {
  const fmtAmount = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  const active = Boolean(forfait.active);

  return (
    <div
      onClick={() => onSelect?.(forfait)}
      className={cn(
        "group relative w-full overflow-hidden rounded-lg border bg-card cursor-pointer",
        "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
        !active && "opacity-50 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className={cn("px-4 pt-4 pb-3", active ? "bg-muted/40" : "bg-muted/20")}>
        <p className="font-medium text-sm truncate mb-2">{forfait.name}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-base font-bold", active ? "text-primary" : "text-foreground")}>
            {fmtAmount(forfait.price)}
          </span>
          <span className="text-xs text-muted-foreground">{forfait.currency}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-1 px-3 py-2 border-t">
        <div className="flex items-center gap-1 flex-1 text-xs text-muted-foreground">
          <Wifi className="h-3 w-3 shrink-0" />
          <span>{formatData(forfait.dataVolumeMb)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Smartphone className="h-3 w-3 shrink-0" />
          <span>{forfait.maxConcurrentDevices}</span>
        </div>
      </div>
    </div>
  );
};
