import React from 'react';
import { useForm } from 'react-hook-form';
import { useRegister } from '../hooks/useRegister';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useRegister();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    registerUser(data);
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl p-4">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight uppercase">Créer un compte</CardTitle>
            <CardDescription className="font-medium text-slate-500">
              Rejoignez Rik WiFi pour profiter d'une connexion haut débit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Prénom & Nom</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Prénom" required {...register("prenom")} className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold px-5" />
                  <Input placeholder="Nom" required {...register("nom")} className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold px-5" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Email</Label>
                <Input type="email" placeholder="m@example.com" required {...register("email")} className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold px-5" />
              </div>
              <div className="grid gap-2">
                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400 ml-1">Mot de passe</Label>
                <Input type="password" required {...register("password")} className="h-14 rounded-2xl bg-slate-50 border-transparent font-bold px-5" />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl font-black tracking-widest bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                {isLoading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
                S'INSCRIRE
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Link to="/login" className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2">
                <ArrowLeft size={14} /> Déjà un compte ? Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
