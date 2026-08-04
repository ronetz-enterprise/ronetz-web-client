import { cn } from "@/shared/lib/utils";
import { formatData, formatDuration } from "@/shared/lib/format";
import type { Forfait } from "../types";
import { Box, Clock, Smartphone, Wifi, type LucideIcon } from "lucide-react";

interface ForfaitFeatureConfig {
  icon: LucideIcon;
  getValue: (forfait: Forfait) => string;
  isUnlimited: (forfait: Forfait) => boolean;
  unlimitedLabel?: string;
}

const FORFAIT_FEATURES: ForfaitFeatureConfig[] = [
  {
    icon: Wifi,
    getValue: (f) => formatData(f.dataVolumeMb),
    isUnlimited: (f) => f.dataVolumeMb === -1 || f.dataVolumeMb === Infinity,
    unlimitedLabel: "Illimité"
  },
  {
    icon: Clock,
    getValue: (f) => formatDuration(f.durationMinutes),
    isUnlimited: (f) => f.durationMinutes === -1 || f.durationMinutes === Infinity,
    unlimitedLabel: "Sans limite"
  },
  {
    icon: Smartphone,
    getValue: (f) => `${f.maxConcurrentDevices}`,
    isUnlimited: (f) => f.maxConcurrentDevices === -1 || f.maxConcurrentDevices === Infinity,
    unlimitedLabel: "∞"
  }
];
interface ForfaitCompactHeaderProps {
  forfait: Forfait;
}

export const ForfaitCompactHeader: React.FC<ForfaitCompactHeaderProps> = ({ forfait }) => {
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  return (
    <div className="rounded-lg border bg-gradient-to-br from-sidebar/20 to-transparent p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-2 bg-sidebar/30 rounded-md shrink-0">
              <Box size={16} className="text-sidebar-foreground" />
            </div>
            <p className="font-medium truncate">{forfait.name}</p>
          </div>
          <p className="text-lg font-bold whitespace-nowrap">
            {fmt(forfait.price)} FCFA
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FORFAIT_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            const isUnlimited = feature.isUnlimited(forfait);
            const value = isUnlimited 
              ? (feature.unlimitedLabel || '∞') 
              : feature.getValue(forfait);

            return (
              <div
                key={index}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border",
                  isUnlimited
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-sidebar/20 border-sidebar/30"
                )}
              >
                <Icon size={10} className={isUnlimited ? "text-primary" : "text-muted-foreground"} />
                <span className="text-[10px] font-medium">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};