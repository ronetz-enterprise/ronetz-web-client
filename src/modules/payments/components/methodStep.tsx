import React from "react";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/shared/lib/utils";
import type { PaymentMethod } from "../types";

interface MethodStepProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  methods: PaymentMethod[];
  isLoading?: boolean;
}

export const MethodStep: React.FC<MethodStepProps> = ({
  selectedProvider,
  onProviderChange,
  methods,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12" aria-live="polite">
        <Loader2 className="size-5 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">Chargement des moyens de paiement…</p>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Aucun moyen de paiement n’est disponible pour ce pays.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Moyen de paiement</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sélectionnez le service Mobile Money à utiliser.
      </p>

      <RadioGroup
        value={selectedProvider}
        onValueChange={onProviderChange}
        className="mt-6 divide-y overflow-hidden rounded-lg border border-border"
      >
        {methods.map((method) => {
          const selected = selectedProvider === method.code;
          return (
            <Label
              key={method.id}
              htmlFor={method.code}
              className={cn(
                "flex cursor-pointer items-center gap-3 bg-card px-4 py-3.5 transition-colors",
                selected ? "bg-accent/70" : "hover:bg-muted/60"
              )}
            >
              {method.logoUrl ? (
                <img
                  src={method.logoUrl}
                  alt=""
                  className="size-9 shrink-0 rounded-md border border-border object-cover"
                />
              ) : (
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold uppercase text-muted-foreground">
                  {method.name.substring(0, 2)}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{method.name}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Paiement depuis votre téléphone
                </span>
              </span>
              <RadioGroupItem value={method.code} id={method.code} />
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
};
