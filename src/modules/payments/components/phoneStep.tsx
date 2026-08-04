import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Smartphone } from 'lucide-react';

interface PhoneStepProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  providerName: string;
}

export const PhoneStep: React.FC<PhoneStepProps> = ({ phone, onPhoneChange, providerName }) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold">Numéro de téléphone</h2>
        <p className="text-sm text-muted-foreground">
          Entrez le numéro {providerName} pour le paiement
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <div className="relative">
          <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="6XX XX XX XX"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="pl-9"
            maxLength={9}
          />
        </div>
        <p className="text-xs text-muted-foreground">Format : 6XX XX XX XX (9 chiffres)</p>
      </div>
    </div>
  );
};
