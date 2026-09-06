import React from "react";
import { Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneStepProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  providerName: string;
}

export const PhoneStep: React.FC<PhoneStepProps> = ({
  phone,
  onPhoneChange,
  providerName,
}) => {
  const digits = phone.replace(/\D/g, "");

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Numéro Mobile Money</h1>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        Saisissez le numéro associé à {providerName}. Une demande de confirmation
        sera envoyée sur ce téléphone.
      </p>

      <div className="mt-6 max-w-md space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <div className="relative">
          <Smartphone
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="6XX XX XX XX"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            className="h-11 pl-10"
            maxLength={15}
            aria-describedby="phone-hint"
          />
        </div>
        <p id="phone-hint" className="text-xs text-muted-foreground">
          {digits.length > 0
            ? digits.length + " chiffre" + (digits.length > 1 ? "s" : "") + " saisi" + (digits.length > 1 ? "s" : "")
            : "Entrez uniquement les chiffres du numéro."}
        </p>
      </div>

      <div className="mt-6 max-w-md rounded-md bg-muted px-4 py-3 text-xs leading-5 text-muted-foreground">
        Après avoir continué, gardez votre téléphone à proximité pour confirmer
        la transaction.
      </div>
    </div>
  );
};
