import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { PaymentMethod } from '../types';
import { Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

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
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Chargement des modes de paiement…</p>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted-foreground">Aucun mode de paiement disponible pour ce pays.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold">Méthode de paiement</h2>
        <p className="text-sm text-muted-foreground">Choisissez votre mode de paiement</p>
      </div>

      <RadioGroup
        value={selectedProvider}
        onValueChange={onProviderChange}
        className="space-y-2"
      >
        {methods.map((method) => (
          <Label
            key={method.id}
            htmlFor={method.code}
            className={cn(
              "flex items-center gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors",
              selectedProvider === method.code
                ? "border-primary/50 bg-primary/5"
                : "hover:bg-muted/50"
            )}
          >
            {method.logoUrl ? (
              <img
                src={method.logoUrl}
                alt={`${method.name} logo`}
                className="h-9 w-9 rounded-md object-cover shrink-0"
              />
            ) : (
              <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground uppercase shrink-0">
                {method.name.substring(0, 2)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{method.name}</p>
              <p className="text-xs text-muted-foreground">Paiement via {method.name}</p>
            </div>
            <RadioGroupItem value={method.code} id={method.code} />
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
};
