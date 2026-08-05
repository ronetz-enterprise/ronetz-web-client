import React from 'react';
import { useForm } from 'react-hook-form';
import { useRegister } from '@/modules/auth/hooks/useRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { RegisterRequest } from '@/modules/auth/types';

const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useRegister();
  const { register, handleSubmit } = useForm<RegisterRequest>();

  const onSubmit = (data: RegisterRequest) => {
    registerUser(data).catch(() => {});
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
          <Label htmlFor="password" className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            {...register("password", { required: "Mot de passe requis" })}
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
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
