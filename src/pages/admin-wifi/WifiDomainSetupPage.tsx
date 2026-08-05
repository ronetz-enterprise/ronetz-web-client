import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { siteApi } from '@/modules/network-ops/api/siteApi';
import { authApi } from '@/modules/auth/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/shared/lib/apiError';
import { useDomains } from '@/modules/network-ops/hooks/useDomain';

const WifiDomainSetupPage: React.FC = () => {
  const { user } = useAuthStore();
  const { exist, loading } = useDomains();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 🔐 Protection accès
  if (!user || user.role !== 'ADMIN_WIFI') {
    return <Navigate to="/login" replace />;
  }

  // ⏳ Attendre la réponse API AVANT de décider
  if (loading || exist === null) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // 🔁 Si domaine existe → redirect
  if (exist) {
    return <Navigate to="/sites" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = name.trim();

    if (!trimmed) {
      toast.error('Indiquez un nom pour votre domaine');
      return;
    }

    setSubmitting(true);

    try {
      // ✅ 1. Création domaine
      await siteApi.createDomain({ name: trimmed });

      // ✅ 2. Le backend attache `domainId` en custom claim sur cet
      // utilisateur Firebase à la création du domaine ; on force un refresh
      // du token pour le récupérer. authStore est abonné à
      // authApi.onSessionChanged, donc `user` se met à jour automatiquement.
      // Note : si le claim met un peu de temps à se propager côté backend,
      // `user.domainId` peut rester temporairement absent — à surveiller.
      await authApi.getAccessToken(true);

      toast.success('Domaine créé');

      // 🔁 navigation propre
      navigate('/sites', { replace: true });
    } catch (err: unknown) {
      toast.error(
        getApiErrorMessage(err, 'Impossible de créer le domaine')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card className="rounded-lg border shadow-lg">
          <CardHeader className="space-y-3 text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Wifi className="h-7 w-7" />
            </div>

            <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
              Votre domaine Wi-Fi
            </CardTitle>

            <CardDescription className="text-base text-muted-foreground">
              Créez un domaine pour regrouper vos sites et routeurs.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2 text-left">
                <Label
                  htmlFor="domain-name"
                  className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Nom du domaine
                </Label>

                <Input
                  id="domain-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex. Hôtel Central, Campus Nord…"
                  autoComplete="organization"
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !name.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création…
                  </>
                ) : (
                  'Créer mon domaine'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WifiDomainSetupPage;