import React, { useState } from "react";
import { PackageSearch, Wifi, Smartphone, Clock, MapPin, Loader2, Ban, RotateCcw } from "lucide-react";
import type { Forfait } from "../types";
import { formatData, formatDuration } from "@/shared/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSites } from "@/modules/network-ops/hooks/useSites";

interface ForfaitDetailProps {
  forfait: Forfait | null;
  onToggleActive?: (id: string) => Promise<unknown>;
}

export const ForfaitDetail: React.FC<ForfaitDetailProps> = ({ forfait, onToggleActive }) => {
  const { sites } = useSites();
  const [isToggling, setIsToggling] = useState(false);
  const fmtAmount = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  if (!forfait) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center p-10 space-y-3">
        <div className="flex h-11 w-11 items-center justify-center border border-border">
          <PackageSearch className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Sélectionnez un forfait dans la liste pour voir sa description.
        </p>
      </div>
    );
  }

  const activeSites = sites.filter((s) => forfait.siteIds?.includes(s.id));

  const handleToggleActive = async () => {
    if (!onToggleActive) return;
    setIsToggling(true);
    try {
      await onToggleActive(forfait.id);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{forfait.name}</h2>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-primary">{fmtAmount(forfait.price)}</span>
            <span className="text-sm text-muted-foreground">{forfait.currency}</span>
          </div>
        </div>
        <Badge variant={forfait.active ? "default" : "outline"}>
          {forfait.active ? "Actif" : "Inactif"}
        </Badge>
      </div>

      {forfait.description && (
        <p className="text-sm text-muted-foreground">{forfait.description}</p>
      )}

      {onToggleActive && (
        <Button
          variant={forfait.active ? "outline" : "default"}
          size="sm"
          onClick={handleToggleActive}
          disabled={isToggling}
          className="gap-1.5"
        >
          {isToggling ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : forfait.active ? (
            <Ban className="h-3.5 w-3.5" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
          {forfait.active ? "Désactiver" : "Réactiver"}
        </Button>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="border border-border p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Durée</span>
          </div>
          <p className="text-sm font-medium text-foreground">{formatDuration(forfait.durationMinutes)}</p>
        </div>
        <div className="border border-border p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wifi className="h-3.5 w-3.5" />
            <span>Volume</span>
          </div>
          <p className="text-sm font-medium text-foreground">{formatData(forfait.dataVolumeMb)}</p>
        </div>
        <div className="border border-border p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Smartphone className="h-3.5 w-3.5" />
            <span>Appareils</span>
          </div>
          <p className="text-sm font-medium text-foreground">{forfait.maxConcurrentDevices}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sites valides</p>
        {activeSites.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeSites.map((site) => (
              <div
                key={site.id}
                className="flex items-center gap-1.5 border border-border px-2.5 py-1 text-xs text-foreground"
              >
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {site.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun site associé.</p>
        )}
      </div>
    </div>
  );
};
