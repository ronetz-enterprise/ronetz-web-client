// components/payment/steps/ConfirmationStep.tsx
import React from 'react';
import { Check, CreditCard, Smartphone } from 'lucide-react';
import { formatData, formatDuration } from '@/shared/lib/format';
import type { Forfait, PaymentProvider } from '../types';

interface ConfirmationStepProps {
  forfait: Forfait;
  phone: string;
  provider: PaymentProvider;
}

const PROVIDER_NAMES: Record<PaymentProvider, string> = {
  MTN_MOMO: 'MTN Mobile Money',
  ORANGE_MONEY: 'Orange Money',
  MOOV_MONEY: 'Moov Money',
};

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ 
  forfait, 
  phone, 
  provider 
}) => {
  const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Confirmation</h2>
        <p className="text-sm text-muted-foreground">
          Vérifiez les informations avant de valider
        </p>
      </div>

      <div className="space-y-3">
        {/* Forfait */}
        <div className="rounded-lg border bg-sidebar/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded">
              <Check size={14} className="text-primary" />
            </div>
            <span className="text-sm font-medium">Forfait sélectionné</span>
          </div>
          <div className="ml-8 space-y-1">
            <p className="font-semibold">{forfait.name}</p>
            <p className="text-sm text-muted-foreground">
              {formatData(forfait.dataVolumeMb)} • {formatDuration(forfait.durationMinutes)} • {forfait.maxConcurrentDevices} appareils
            </p>
          </div>
        </div>

        {/* Méthode de paiement */}
        <div className="rounded-lg border bg-sidebar/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded">
              <CreditCard size={14} className="text-primary" />
            </div>
            <span className="text-sm font-medium">Méthode de paiement</span>
          </div>
          <p className="ml-8 font-semibold">{PROVIDER_NAMES[provider]}</p>
        </div>

        {/* Téléphone */}
        <div className="rounded-lg border bg-sidebar/10 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded">
              <Smartphone size={14} className="text-primary" />
            </div>
            <span className="text-sm font-medium">Numéro de téléphone</span>
          </div>
          <p className="ml-8 font-semibold">{phone}</p>
        </div>

        {/* Montant total */}
        <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Montant à payer</span>
            <span className="text-xl font-bold text-primary">
              {fmt(forfait.price)} FCFA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};