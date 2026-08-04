import React from "react";
import { Wifi, Smartphone } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Forfait } from "../types";
import { formatData } from "@/shared/lib/format";

interface ForfaitCardProps {
  forfait: Forfait;
  selected?: boolean;
  onSelect?: (forfait: Forfait) => void;
  className?: string;
  /** Admin contexts must stay clickable on inactive forfaits (e.g. to reactivate them). */
  alwaysInteractive?: boolean;
}

export const InternetPlanCard: React.FC<ForfaitCardProps> = ({ forfait, selected, onSelect, className, alwaysInteractive }) => {
  const fmtAmount = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  const active = Boolean(forfait.active);

  return (
    <div
      onClick={() => onSelect?.(forfait)}
      className={cn(
        "group relative w-full overflow-hidden bg-card cursor-pointer  border",
        "transition-all duration-300 ease-out",
        "hover:z-10 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-sm",
        selected && "border-primary/40",
        !active && (alwaysInteractive ? "opacity-60" : "opacity-50 pointer-events-none"),
        className
      )}
    >
      <div className={cn(selected && "bg-primary/5")}>
        {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <p className="font-medium text-sm truncate mb-2">{forfait.name}</p>
        <div className="flex items-baseline gap-1">
          <span className={cn("text-base font-bold", active ? "text-primary" : "text-foreground")}>
            {fmtAmount(forfait.price)}
          </span>
          <span className="text-xs text-muted-foreground">{forfait.currency}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-1 px-4 pb-3">
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
      
    </div>
  );
};
