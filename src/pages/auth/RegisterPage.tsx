import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/modules/auth/hooks/useRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCountriesLookup } from '@/modules/master-data/hooks/useCountriesLookup';
import { useMacAddress } from '@/shared/hooks/useMacAddress';
import { cn } from '@/shared/lib/utils';
import type { SignInRequest } from '@/modules/auth/types';
import type { Country } from '@/modules/master-data/types';

const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useRegister();
  const { countries, isLoading: isCountriesLoading, error: countriesError } = useCountriesLookup();
  const macAddress = useMacAddress();
  const { register, handleSubmit, setValue, watch } = useForm<SignInRequest>();

  const [dialCode, setDialCode] = useState<string>('');

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setValue('countryIsoCode', code);
    const selected = countries.find((c: Country) => c.code === code);
    const newDialCode = selected?.dialCode ?? '';
    setDialCode(newDialCode);
    if (newDialCode) {
      setValue('phoneNumber', '+' + newDialCode);
    } else {
      setValue('phoneNumber', '');
    }
  };

  const onSubmit = (data: SignInRequest) => {
    registerUser({ ...data, userMacAddress: macAddress });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-semibold tracking-tight">Créer un compte</h2>
        <p className="text-sm text-muted-foreground">
          Rejoignez Rik WiFi pour profiter d'une connexion haut débit
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Prénom &amp; Nom</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Prénom"
              {...register("firstName", { required: "Prénom requis" })}
            />
            <Input
              placeholder="Nom"
              {...register("lastName", { required: "Nom requis" })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", { required: "Email requis" })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="phone" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Téléphone</Label>
          {countriesError && (
            <p className="text-xs text-destructive">
              Impossible de charger les pays. Vérifiez la variable VITE_API_URL puis rechargez.
            </p>
          )}
          <div className="flex gap-2">
            <select
              {...register("countryIsoCode", { required: "Pays requis" })}
              onChange={handleCountryChange}
              className="w-1/3 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors focus:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Pays</option>
              {countries
                .filter((c: Country) => c.active)
                .map((c: Country) => (
                  <option key={c.id} value={c.code}>
                    {c.dialCode ? `+${c.dialCode} ` : ''}{c.name}
                  </option>
                ))}
            </select>
            <div className="relative flex-1">
              {dialCode && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none select-none">
                  +{dialCode}
                </span>
              )}
              <Input
                id="phone"
                type="tel"
                placeholder={dialCode ? '' : '6xx xx xx xx'}
                className={cn(dialCode ? 'pl-12' : '')}
                {...register("phoneNumber", { required: "Téléphone requis" })}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            {...register("rawPassword", { required: "Mot de passe requis" })}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading || isCountriesLoading}
          className="w-full mt-1"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer mon compte
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link to="/login" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
